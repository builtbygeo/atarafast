import { notFound } from "next/navigation"
import { articles, commonTags } from "@/lib/blog-data"
import { Metadata, ResolvingMetadata } from "next"

// Simple React-based Markdown renderer since we just installed standard react-markdown
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
    if (!article) return { title: "Not Found" }

    return {
        title: article.meta.title,
        description: article.meta.description,
        alternates: {
            canonical: article.meta.canonical,
        },
        openGraph: {
            title: article.meta.ogTitle,
            description: article.meta.ogDescription,
            url: article.meta.canonical,
            siteName: commonTags.siteName,
            images: article.meta.ogImage ? [{ url: article.meta.ogImage }] : [],
            locale: commonTags.locale,
            type: "article",
        },
        twitter: {
            card: "summary_large_image",
            title: article.meta.ogTitle,
            description: article.meta.ogDescription,
            images: article.meta.ogImage ? [article.meta.ogImage] : [],
            creator: commonTags.twitterSite,
        },
    }
}

export default async function BlogPostPage(props: Props) {
    const params = await props.params;
    const article = articles.find((a) => a.slug === params.slug)
    if (!article) notFound()

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": article.faq.map((item) => ({
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
        "headline": article.meta.title,
        "description": article.meta.description,
        "image": article.meta.ogImage ? [article.meta.ogImage] : [],
        "author": {
            "@type": "Organization",
            "name": commonTags.author,
            "url": "https://atarafast.com/"
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
            "@id": article.meta.canonical
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

            {/* Header / Nav could go here if needed, keeping it simple for now */}
            <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-md">
                <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                    <a href="/" className="font-black text-xl text-primary tracking-tighter">Atara</a>
                    <a href="/bg" className="text-sm font-medium text-muted-foreground hover:text-foreground">BG</a>
                </div>
            </header>

            <main className="container mx-auto px-6 py-16 sm:py-24 max-w-3xl">
                <h1 className="text-4xl sm:text-5xl font-black tracking-tighter mb-8 leading-tight">
                    {article.title}
                </h1>

                <div className="prose prose-invert prose-p:text-muted-foreground prose-headings:text-foreground prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-img:rounded-3xl max-w-none">
                    <ReactMarkdown>{article.contentMarkdown}</ReactMarkdown>
                </div>

                <div className="mt-16 pt-16 border-t border-border/50">
                    <h2 className="text-3xl font-black tracking-tight mb-8">Frequently Asked Questions</h2>
                    <div className="space-y-6">
                        {article.faq.map((item, idx) => (
                            <div key={idx} className="bg-secondary/20 p-6 rounded-2xl border border-border/50">
                                <h3 className="text-lg font-bold mb-2 text-foreground">{item.q}</h3>
                                <p className="text-muted-foreground">{item.a}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CTA */}
                <div className="mt-20 p-10 bg-primary/10 rounded-3xl border border-primary/20 text-center">
                    <h2 className="text-2xl font-black mb-4">Start your fasting journey today</h2>
                    <p className="text-muted-foreground mb-8">Install the Atara PWA in seconds. No App Store required. 100% private.</p>
                    <a href={process.env.NODE_ENV === "development" ? "/app" : "https://app.atarafast.com"} className="inline-block px-8 py-4 bg-primary text-primary-foreground font-bold rounded-2xl hover:scale-105 transition-transform shadow-lg shadow-primary/20">
                        Open App
                    </a>
                </div>
            </main>

            <footer className="py-12 border-t border-border/50 text-center">
                <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} Atara. All rights reserved.</p>
                <p className="text-xs text-muted-foreground/60 mt-2">100% private • No ads in free version • Made in Europe</p>
            </footer>
        </article>
    )
}
