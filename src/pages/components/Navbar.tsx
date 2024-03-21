import {Component} from "react"
import Avatar from "@/pages/components/Avatar"
import Searchbar from "@/pages/components/Searchbar"
import Link from "next/link"

interface NavbarProps {
    src?: string
    alt?: string
    isGlass?: boolean
}

export default class Navbar extends Component<NavbarProps, {}> {
    render() {
        return (
            <div
                className="bg-[#22219B] z-50 w-full flex justify-center items-center"
                style={{height: "60px"}}>
                <div className="flex flex-row items-center">
                    <Link href="/" className="bg-white flex justify-center items-center rounded-full mr-6" style={{ height: "42px", width: "42px"}}>
                        <img src="favicon.ico" alt="logo" style={{height: "36px"}} width="36"/>
                    </Link>
                    <Searchbar placeholder="搜索 eBPF 程序" height="36px" width="380px" textColor={"#fff"}/>
                    <div style={{width: "580px"}}></div>
                    <Link href="/search" className="text-sm text-white mr-3 ml-3">搜索</Link>
                    <Link href="" className="text-sm text-white mr-3 ml-3">文档</Link>
                    <Link href="" className="text-sm text-white mr-3 ml-3">关于</Link>
                    <Avatar src={this.props.src} alt={this.props.alt}/>
                </div>
            </div>
        );
    }
}