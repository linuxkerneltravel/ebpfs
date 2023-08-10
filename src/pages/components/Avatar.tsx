import {Component} from "react";
import {withRouter} from "next/router";
import {WithRouterProps} from "next/dist/client/with-router";

interface AvatarProps extends WithRouterProps {
    src?: string;
    alt?: string;
}

class Avatar extends Component<AvatarProps> {
    render() {
        return (
            <img className="rounded-full shadow-lg mr-2"
                   src={this.props.src ? this.props.src : "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"}
                   alt={this.props.alt ? this.props.alt : "avatar"}
                   style={{height: "48px", width: "48px"}}
                   onClick={() => this.props.router.push("/account")}
            />
        );
    }
}

export default withRouter(Avatar);