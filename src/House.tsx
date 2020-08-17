import React, { Component, MouseEvent } from 'react';
import "./House.css";
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Card, CardContent, Typography } from '@material-ui/core';


interface HouseProps extends RouteComponentProps<any> {
    id: number;
    name: string;
}

interface HouseState {
    firstTimeShown: boolean
}

const colors = ['265077', '04407c', '494B68', '1E4258', '2D5F5D']
const delayClasses = ["short", "medium", "long"]


class House extends Component<HouseProps, HouseState> {

    backgroundColor: string;

    constructor(props: HouseProps) {
        super(props)
        this.backgroundColor = colors[this.countNumber % colors.length];
        this.state = {
            firstTimeShown: false
        }
    }

    componentDidMount() {
        setTimeout(() => {this.setState({ firstTimeShown: true })}, 1000)
    }

    handleClick(event: MouseEvent) {
        this.props.history.push("/houseDetails/" + this.props.id + "/" + this.backgroundColor );
    };

    countNumber = this.props.id;
        
    render() {

        let animationClass = "";
        if (!this.state.firstTimeShown) {
            let rndNumber = Math.round(Math.random() * 3) % 3
            let delayClass = delayClasses[rndNumber]

            animationClass = "animate__fadeInUp animate__animated animate_delay_" + delayClass
        } else {
            animationClass = "hover_effect"
        }
        return (
            <Card className={"houseCard " + animationClass}
                onClick={this.handleClick.bind(this)}
                style={{ backgroundColor: '#' + this.backgroundColor }} >
                <CardContent>
                    <Typography variant="h3" align="center" color="textSecondary" className="text_shadow">
                        {this.props.id}
                    </Typography>
                    <Typography variant="h5" align="center" color="textPrimary" className="text_shadow">
                        {this.props.name}
                    </Typography>
                    <Typography align="center" className="click_info">
                        Click for more details
                    </Typography>
                </CardContent>
            </Card>
        );
    }

}

export default withRouter(House);