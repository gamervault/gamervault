import Link from "next/link";

function PageDoesNotExist() {
    return (
        <div className="w-full flex flex-col items-center gap-12 min-h-[80vh] justify-center">
            <h1 className="text-3xl font-bold text-center">404 Error: This page doesn{"'"}t exist!</h1>
            <Link href="/" className="button-secondary w-full max-w-96 text-lg font-medium text-center">Return home</Link>
        </div>
    );
}

export default PageDoesNotExist;