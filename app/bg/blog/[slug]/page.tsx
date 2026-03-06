import { notFound } from "next/navigation"
import { articles, commonTags } from "@/lib/blog-data"
import { Metadata, ResolvingMetadata } from "next"
import ReactMarkdown from "react-markdown"

interface Props {
    params: Promise<{ slug: string }>
}

export async function generateMetadata(
    props: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const params = await props.params;
    const article = articles.find((a) => a.slug === params.slug)
    if (!article) return { title: "Не е намерено" }

    return {
        title: article.bgMeta.title,
        description: article.bgMeta.description,
        alternates: {
            canonical: article.bgMeta.canonical,
        },
        openGraph: {
            title: article.bgMeta.ogTitle,
            description: article.bgMeta.ogDescription,
            url: article.bgMeta.canonical,
            siteName: commonTags.siteName,
            images: article.bgMeta.ogImage ? [{ url: article.bgMeta.ogImage }] : (article.meta.ogImage ? [{ url: article.meta.ogImage }] : []),
            locale: commonTags.bgLocale,
            type: "article",
        },
        twitter: {
            card: "summary_large_image",
            title: article.bgMeta.ogTitle,
            description: article.bgMeta.ogDescription,
            images: article.bgMeta.ogImage ? [article.bgMeta.ogImage] : (article.meta.ogImage ? [article.meta.ogImage] : []),
            creator: commonTags.twitterSite,
        },
    }
}

export default async function BgBlogPostPage(props: Props) {
    const params = await props.params;
    const article = articles.find((a) => a.slug === params.slug)
    if (!article) notFound()

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": article.bgFaq.map((item) => ({
            "@type": "Question",
            "name": item.q,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": item.a
            }
        }))
    }

    const articleSchema = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": article.bgMeta.title,
        "description": article.bgMeta.description,
        "image": article.bgMeta.ogImage ? [article.bgMeta.ogImage] : (article.meta.ogImage ? [article.meta.ogImage] : []),
        "author": {
            "@type": "Organization",
            "name": commonTags.author,
            "url": "https://atarafast.com/bg"
        },
        "publisher": {
            "@type": "Organization",
            "name": commonTags.siteName,
            "logo": {
                "@type": "ImageObject",
                "url": "https://atarafast.com/icon.png"
            }
        },
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": article.bgMeta.canonical
        }
    }

    return (
        <article className="min-h-screen bg-background">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
            />

            <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-md">
                <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                    <a href="/bg" className="font-black text-xl text-primary tracking-tighter">Atara</a>
                    <a href="/" className="text-sm font-medium text-muted-foreground hover:text-foreground">EN</a>
                </div>
            </header>

            <main className="container mx-auto px-6 py-16 sm:py-24 max-w-3xl">
                <h1 className="text-4xl sm:text-5xl font-black tracking-tighter mb-8 leading-tight">
                    {article.bgTitle}
                </h1>

                <div className="prose prose-invert prose-p:text-muted-foreground prose-headings:text-foreground prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-img:rounded-3xl max-w-none">
                    <ReactMarkdown>{article.bgContentMarkdown}</ReactMarkdown>
                </div>

                <div className="mt-16 pt-16 border-t border-border/50">
                    <h2 className="text-3xl font-black tracking-tight mb-8">Често Задавани Въпроси</h2>
                    <div className="space-y-6">
                        {article.bgFaq.map((item, idx) => (
                            <div key={idx} className="bg-secondary/20 p-6 rounded-2xl border border-border/50">
                                <h3 className="text-lg font-bold mb-2 text-foreground">{item.q}</h3>
                                <p className="text-muted-foreground">{item.a}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CTA */}
                <div className="mt-20 p-10 bg-primary/10 rounded-3xl border border-primary/20 text-center">
                    <h2 className="text-2xl font-black mb-4">Започнете своя фастинг днес</h2>
                    <p className="text-muted-foreground mb-8">Инсталирайте Atara PWA за секунди. Без App Store. 100% поверително.</p>
                    <a href={process.env.NODE_ENV === "development" ? "/app" : "https://app.atarafast.com"} className="inline-block px-8 py-4 bg-primary text-primary-foreground font-bold rounded-2xl hover:scale-105 transition-transform shadow-lg shadow-primary/20">
                        Отвори Приложението
                    </a>
                </div>
            </main>

            <footer className="py-12 border-t border-border/50 text-center">
                <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} Atara. Всички права запазени.</p>
                <p className="text-xs text-muted-foreground/60 mt-2">100% поверително • Без реклами в безплатната версия • Създадено в Европа</p>
            </footer>
        </article>
    )
}
