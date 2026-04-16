import Link from "next/link";

export default function NotFound() {
    return (
        <main style={{ padding: "40px", textAlign: "center" }}>
            <h1>
                <span className="text-orange-400 text-xl font-bold">404</span>
                <br></br>- Page Not Found</h1>
            <p className="mb-4">お探しのページは見つかりませんでした。</p>
            <Link href="/" className="underline">トップページに戻る</Link>
        </main>
    );
}