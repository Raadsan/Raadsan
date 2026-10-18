import ProductSystemPage from "@/components/website/ProductSystemPage"

type Props = {
  params: Promise<{ slug: string }>
}

export default async function ProductBySlugPage({ params }: Props) {
  const { slug } = await params
  return <ProductSystemPage slug={slug} />
}
