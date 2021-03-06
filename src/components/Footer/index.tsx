import { Logo } from "../../components";
import { FooterCopyright } from "./FooterCopyright";

const Footer = () => (
    <div className="bg-gray-100 flex flex-col items-center justify-center pt-2 pb-4 absolute bottom-0 left-0 right-0 mt-64">
        <Logo classes="text-main-100" />
        <div className="mt-8 text-sm">
            <FooterCopyright />
        </div>
    </div>
);

export default Footer;
