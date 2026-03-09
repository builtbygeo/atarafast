export interface Article {
    slug: string;
    title: string;
    bgTitle: string;
    meta: {
        title: string;
        description: string;
        ogTitle: string;
        ogDescription: string;
        ogImage: string;
        canonical: string;
    };
    bgMeta: {
        title: string;
        description: string;
        ogTitle: string;
        ogDescription: string;
        ogImage: string;
        canonical: string;
    };
    contentMarkdown: string;
    bgContentMarkdown: string;
    faq: {
        q: string;
        a: string;
    }[];
    bgFaq: {
        q: string;
        a: string;
    }[];
}
