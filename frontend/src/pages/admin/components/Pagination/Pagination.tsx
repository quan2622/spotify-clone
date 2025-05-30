/* eslint-disable @typescript-eslint/no-explicit-any */
import Pagination from 'rc-pagination';
import "./Pagination.css"
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMusicStore } from "../../../../stores/useMusicStore";

const PaginationTable = () => {
  const { stat, getSongPaginate, currentPage } = useMusicStore();
  // Paginate
  const totalItems = stat.totalSong;
  const pageSize = 4;

  // console.log('checl page size: ', pageSize);

  const onPageChange = async (page: any) => {
    await getSongPaginate(page);
  };

  return (
    <div className="flex items-center justify-center w-full mt-4 pt-2 h-[100px]">
      <Pagination
        current={currentPage}
        total={totalItems}
        pageSize={pageSize}
        onChange={onPageChange}
        showLessItems
        itemRender={(page, type, originalElement) => {
          if (type === 'page') {
            return (
              <button className={`text-white ${page === currentPage ? 'bg-emerald-500' : 'bg-zinc-400'}`} >
                {page}
              </button>
            );
          }
          if (type === 'jump-next') {
            return <button className="flex items-center text-white">
              ...
            </button>;
          }

          if (type === 'jump-prev') {
            return <button className="flex items-center text-white">
              ...
            </button>;
          }
          if (type === 'prev') {
            return <button className="flex items-center bg-zinc-600 text-white">
              <ChevronLeft className="w-full h-full" />
            </button>;
          }
          if (type === 'next') {
            return <button className="flex items-center bg-zinc-600 text-white">
              <ChevronRight className="w-full h-full" />
            </button>;
          }
          return originalElement;
        }}
      />
    </div>
  )
}
export default PaginationTable