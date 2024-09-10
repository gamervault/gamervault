import Link from "next/link";

function LoginFailedPage() {
    return (
        <div className="flex items-center justify-center min-h-[80vh]">
            <div className="rounded-md border-bg-stroke-grey border-2 max-w-full w-[32rem] box-border p-8 flex flex-col gap-4 text-center">
                <h1 className="text-xl font-semibold text-center mb-2">Login Failed</h1>
                <p className="mb-2 font-light">Please try again later</p>
                <Link href="/" className="button-secondary w-full text-lg font-medium">Return home</Link>
            </div>
        </div>
    );
}

export default LoginFailedPage;