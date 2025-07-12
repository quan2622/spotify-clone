import _ from "lodash";
import { AlbumCategoryCache } from "../models/albumCategoryCache.js";
import albumService from "./album.service.js";


const getCategoryAlbums = async (userId, categoryKey, page, pageSize) => {
  const cached = await AlbumCategoryCache.findOne({
    userId,
    categoryKey,
    expiresAt: { $gt: new Date() }
  }).populate({
    path: "albumIds",
    populate: { path: "genreId", select: 'name' }
  });

  if (cached) {
    return {
      EC: 0,
      EM: "Ok",
      data: cached.albumIds
    };
  }

  const data = await generateCategoryAlbums(userId, categoryKey, page, pageSize);
  if (!_.isEmpty(data)) {
    if (categoryKey !== "new_releases")
      await cacheResults(userId, categoryKey, data);

    return {
      EC: 0,
      EM: "Ok",
      data
    };
  } else {
    return {
      EC: 0,
      EM: "No data here",
      data: []
    }
  }
}

const generateCategoryAlbums = async (userId, categoryKey, page, pageSize) => {
  const algorithms = {
    'recent_listening': () => albumService.getRecentListeningAlbums(userId, page, pageSize),
    'popular_albums': () => albumService.getPopularAlbums(page, pageSize),
    'recommended': () => albumService.getRecommendedAlbums(userId, page, pageSize),
    'new_releases': () => albumService.getNewReleases(page, pageSize)
  };

  const algorithm = algorithms[categoryKey];
  return algorithm ? await algorithm() : [];
}

const cacheResults = async (userId, categoryKey, data) => {
  const albumIds = data.map(record => record._id);
  const expiresAt = new Date();

  const cacheDurations = {
    'recent_listening': 3, // 3 hour
    'popular_albums': 6,   // 6 hours  
    'recommended': 24,     // 24 hours
    'new_releases': 12     // 12 hours
  };

  expiresAt.setHours(expiresAt.getHours() + (cacheDurations[categoryKey] || 6));

  await AlbumCategoryCache.findOneAndUpdate(
    { userId, categoryKey },
    { albumIds, expiresAt, generatedAt: new Date() },
    { upsert: true, new: true }
  );
}


export default {
  getCategoryAlbums
}