import { H1 } from "@/app/ui/heading";
import UploadForm from "@/app/ui/gallery/form";
import { GalleryCardsWrapper } from "@/app/ui/gallery/cards";
import { Suspense } from "react";
import GalleryPagination from "@/app/ui/gallery/pagination";
import { GalleryCardsSkeleton, PaginationSkeleton } from "@/app/ui/skeletons";

export default async function GalleryPage(props: {
  searchParams?: Promise<{
    page?: string;
  }>;
}) {

  const searchParams = await props.searchParams;
  const page = Number(searchParams?.page) || 1
  const limit = 12;

  return (
    <div>
      <H1>Gallery</H1>

      <UploadForm />

      <Suspense fallback={<GalleryCardsSkeleton />}>
        <GalleryCardsWrapper page={page} limit={limit} />
      </Suspense>

      <Suspense fallback={<PaginationSkeleton />}>
        <GalleryPagination page={page} limit={limit} />
      </Suspense>

    </div>
  );
}
