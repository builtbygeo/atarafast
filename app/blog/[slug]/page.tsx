import { notFound } from "next/navigation"
import { articles, commonTags } from "@/lib/blog-data"
import { Metadata, ResolvingMetadata } from "next"
import { Logo } from "@/components/logo"

// Simple React-based Markdown renderer since we just installed standard react-markdown
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

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
        "mainEntity": article.faq.map((item: { q: string, a: string }) => ({
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
        <article className="min-h-screen bg-[#0f0f0f] text-white dark">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
            />

            {/* Header / Nav */}
            <header className="sticky top-0 z-50 w-full border-b border-white/[0.05] bg-black/80 backdrop-blur-xl">
                <div className="container mx-auto px-6 h-24 flex items-center justify-between">
                    <div className="flex items-center gap-12">
                        <a href="/" className="hover:opacity-80 transition-opacity">
                            <Logo className="w-24 text-white" />
                        </a>
                        <nav className="hidden md:flex items-center gap-8 text-[11px] font-black uppercase tracking-[0.2em] text-white/30">
                            <a href="/" className="hover:text-white transition-colors">Home</a>
                            <a href="/#pricing" className="hover:text-white transition-colors">Pricing</a>
                            <a href="/#faq" className="hover:text-white transition-colors">FAQ</a>
                        </nav>
                    </div>
                    <div className="flex items-center gap-6">
                        <a 
                            href="/app" 
                            className="text-[11px] font-black uppercase tracking-[0.3em] bg-white text-black px-8 py-3.5 rounded-full hover:bg-primary transition-all duration-300 hover:scale-105 active:scale-95 shadow-xl shadow-white/5"
                        >
                            Open App
                        </a>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-6 py-16 sm:py-24 max-w-3xl">
                <h1 className="text-4xl sm:text-5xl font-black tracking-tighter mb-8 leading-tight">
                    {article.title}
                </h1>

                <div className="prose prose-invert prose-zinc max-w-none 
                    prose-p:text-zinc-400 prose-p:leading-relaxed prose-p:mb-6 
                    prose-headings:text-white prose-headings:font-black prose-headings:tracking-tight prose-headings:mt-12 prose-headings:mb-6
                    prose-a:text-primary prose-a:font-bold prose-a:no-underline hover:prose-a:underline 
                    prose-img:rounded-[2.5rem] prose-img:mt-12 prose-img:mb-12
                    prose-table:w-full prose-table:my-8 prose-th:text-primary prose-th:text-left prose-th:p-4 prose-th:border-b prose-th:border-white/10
                    prose-td:p-4 prose-td:border-b prose-td:border-white/5 prose-td:text-zinc-400">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{article.contentMarkdown}</ReactMarkdown>
                </div>

                <div className="mt-16 pt-16 border-t border-border/50">
                    <h2 className="text-3xl font-black tracking-tight mb-8">Frequently Asked Questions</h2>
                    <div className="space-y-6">
                        {article.faq.map((item: { q: string, a: string }, idx: number) => (
                            <div key={idx} className="bg-white/[0.02] p-8 rounded-[2rem] border border-white/5 hover:border-white/10 transition-colors">
                                <h3 className="text-xl font-bold mb-3 text-white">{item.q}</h3>
                                <p className="text-zinc-400 leading-relaxed">{item.a}</p>
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
