import {Component} from "react";
import Avatar from "@/pages/components/Avatar";

export default class Navbar extends Component<{}, {}> {
    render() {
        return (
            <div className="glass fixed z-50 w-full shadow-lg flex items-center"
                 style={{height: "60px", backgroundColor: "rgba(255,255,255,0.8)"}}>
                <div className="w-full"/>
                <div className="flex mr-2">
                    <Avatar/>
                </div>
            </div>
        );
    }
}