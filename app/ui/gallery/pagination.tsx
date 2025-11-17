import { getGallery } from '@/app/lib/gallery/data';
import Pagination from '../pagination'

export default async function GalleryPagination({ page, limit }: { page: number, limit: number }) {
  const { total } = await getGallery({ page, limit });
  const totalPages = Math.ceil(total / limit)
  return (
    <Pagination totalPages={totalPages} />
  )
}
