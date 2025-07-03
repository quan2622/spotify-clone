import { Song } from "../models/song.model.js";
import { Album } from "../models/album.model.js";
import { User } from "../models/user.model.js";
import { ListenHistory, LoginHistory } from "../models/History.model.js";
import {
  startOfISOWeek,
  subWeeks,
  format,
  startOfMonth,
  subMonths,
  getMonth,
  differenceInCalendarWeeks,
  getHours,
  startOfDay,
  endOfDay,
} from "date-fns";

export const getAllStat = async (req, res, next) => {
  try {
    const [totalSong, totalAlbum, totalUser, uniqueArtists] = await Promise.all(
      [
        Song.countDocuments(),
        Album.countDocuments(),
        User.countDocuments(),

        Song.aggregate([
          {
            $unionWith: {
              coll: "albums",
              pipeline: [],
            },
          },
          {
            $group: { _id: "$artist" },
            // group by artist field
          },
          {
            $count: "count",
          },
        ]),
      ]
    );

    res.status(200).json({
      totalAlbum,
      totalSong,
      totalUser,
      uniqueArtists: uniqueArtists[0]?.count || 0,
    });
  } catch (error) {
    next(error);
  }
};

export const recordListen = async (req, res, next) => {
  try {
    const { songId, userId } = req.body;
    // console.log(songId, userId);
    if (!songId || !userId) {
      return res.status(400).json({
        success: false,
        message: "Miss songId, userId or timestamp",
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const start = startOfDay(today);
    const end = endOfDay(today);

    const countListenToday = await ListenHistory.countDocuments({
      songId,
      userId,
      date: { $gte: start, $lte: end },
    });

    if (countListenToday.length > 0) {
      if (countListenToday[0].count >= 20) {
        return res.json({
          success: false,
          message: "Vượt quá giới hạn 20 lượt nghe/ngày",
        });
      }
    }

    await ListenHistory.findOneAndUpdate(
      {
        songId,
        userId,
        date: today,
      },
      {
        $inc: { count: 1 },
        $setOnInsert: { songId, userId, date: today },
      },
      { upsert: true, new: true }
    );
    const song = await Song.findByIdAndUpdate(
      { _id: songId },
      { $inc: { totalListens: 1 } }
    );

    res.status(200).json({
      success: true,
      totalListens: song.totalListens,
      message: "Lượt nghe đã được ghi nhận",
    });
  } catch (error) {
    next(error.message);
  }
};

export const getDataAnalysts = async (req, res, next) => {
  try {
    const { type } = req.query; // type can be 'week' or 'month'
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let startDate, dateFormat;
    let endDate = new Date(today);
    let key = [];

    if (type === "week") {
      // C1
      // const dayOfWeek = today.getDay();
      // const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
      // const startOfWeek = new Date(today); //tìm ngày bắt đầu của tuần hiện tại - THỨ 2
      // startOfWeek.setDate(today.getDate() + diffToMonday);
      // startDate = new Date(startOfWeek);
      // startDate.setDate(startOfWeek.getDate() - 7 * 5); // tìm ngày thứ 2 của 5 tuần trước
      // endDate = new Date(startOfWeek);
      // endDate.setDate(startOfWeek.getDate() - 1); //chủ nhật gần nhất
      // C2
      const startOfLastMonth = startOfMonth(subMonths(today, 1));

      startDate = startOfLastMonth;
      endDate = today;
      const startOfThisWeek = startOfISOWeek(today, { weekStartsOn: 1 });

      const deffWeek = differenceInCalendarWeeks(endDate, startDate, {
        weekStartsOn: 1,
      });

      dateFormat = "%G-%V"; //theo chuẩn ISO
      for (let i = deffWeek; i >= 1; i--) {
        key.push(format(subWeeks(startOfThisWeek, i), "RRRR-II"));
      }
    } else if (type === "month") {
      // const startOfThisMonth = new Date(today.getFullYear(), today.getMonth(), 1); //ngày đầu tiên của tháng hiện tại
      // startDate = new Date(startOfThisMonth);
      // startDate.setMonth(startOfThisMonth.getMonth() - 3);

      const startOfThisMonth = startOfMonth(today);
      const currentMonthIndex = getMonth(today);
      startDate =
        currentMonthIndex === 0
          ? startOfThisMonth
          : subMonths(startOfThisMonth, currentMonthIndex);
      endDate = today;
      dateFormat = "%Y-%m";

      for (let i = currentMonthIndex; i >= 1; i--) {
        key.push(format(subMonths(startOfThisMonth, i), "yyyy-MM"));
      }
    } else {
      return res
        .status(400)
        .json({ message: "Invalid type. Use 'week' or 'month'" });
    }
    // console.log(startDate, endDate);

    // Total Login
    const Login = await getAggregateStats(
      LoginHistory,
      startDate,
      endDate,
      dateFormat,
      key,
      "totalLogin"
    );
    // Total Listen
    const Listen = await getAggregateStats(
      ListenHistory,
      startDate,
      endDate,
      dateFormat,
      key,
      "totalListen"
    );

    const data = Login.map((item) => {
      const listen = Listen.find((itemListen) => itemListen._id === item._id);
      // console.log(listen);
      return {
        _id: item._id,
        totalLogin: item.totalLogin,
        totalListen: listen.totalListen,
      };
    });

    res.status(200).json(data);
  } catch (error) {
    next(error.message);
  }
};

const getAggregateStats = async (
  collection,
  startDate,
  endDate,
  dateFormat,
  key,
  valueField
) => {
  const raw_stats = await collection.aggregate([
    {
      $match: { date: { $gte: startDate, $lte: endDate } },
    },
    {
      $group: {
        _id: { $dateToString: { format: dateFormat, date: "$date" } },
        total: { $sum: "$count" },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ]);

  let stats = new Map();
  key.forEach((k) => stats.set(k, 0));

  raw_stats.forEach((item) => {
    stats.set(item._id, item.total);
  });

  return Array.from(stats.entries()).map(([k, v]) => ({
    _id: k,
    [valueField]: v,
  }));
};