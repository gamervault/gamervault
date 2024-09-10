import Link from "next/link";
import Image from "next/image";

function Footer() {
    return (
        <footer className="border-t-2 border-bg-stroke-grey min-h-56 px-6 md:px-12 py-6 flex flex-col md:flex-row justify-center items-center md:justify-evenly gap-8 mt-auto">
            <h2 className="text-4xl font-bold w-full max-w-[32rem] text-center md:text-left">Have a game suggestion? <Link href="/submit" className="text-blue underline underline-offset-8 hover:text-dark-blue transition-all">Submit it here</Link></h2>

            {/* Links */}
            <div className="w-full max-w-64 flex flex-col gap-6">
                <a href="https://discord.com/invite/vRznRhteEM" className="border-b-[1px] border-off-white p-2 flex flex-row w-full">
                    <p className="text-xl">Discord</p>
                    <Image src="/diagnol_arrow.svg" width={23} height={23} alt="Visit link" className="w-4 ml-auto" />
                </a>
                <a href="https://www.instagram.com/itskaiwl/" className="border-b-[1px] border-off-white p-2 flex flex-row w-full">
                    <p className="text-xl">Instagram</p>
                    <Image src="/diagnol_arrow.svg" width={23} height={23} alt="Visit link" className="w-4 ml-auto" />
                </a>
            </div>
        </footer>
    );
}

export default Footer;