import React from 'react';
import { Link, withRouter, RouteComponentProps } from "react-router-dom";
import axios from "axios";
import { Card, Table, TableBody, TableCell, TableRow, Typography } from '@material-ui/core';
import './HouseDetail.css';

interface HouseDetailProps extends RouteComponentProps<any> {
  houseId: string;
  backgroundColor: string;
}

interface HouseJsonType {
  url: URL;
  name: string;
  region: string;
  coatOfArms: string;
  words: string;
  titles?: (string)[] | null;
  seats?: (string)[] | null;
  currentLord: string;
  heir: string;
  overlord: string;
  founded: string;
  founder: string;
  diedOut: string;
  ancestralWeapons?: (string)[] | null;
  cadetBranches?: (null)[] | null;
  swornMembers?: (string)[] | null;
}

interface IState {
  data?: HouseJsonType;
  houseId?: number;
}

class HouseDetail extends React.Component<HouseDetailProps, IState>{

  state: IState;

  constructor(props: HouseDetailProps) {
    super(props);
    this.state = {};
  }

  fetchContent() {
    axios.get("https://anapioficeandfire.com/api/houses/" + this.props.match.params.houseId)
      .then(res => {
        this.setState({ data: res.data, houseId: parseInt(this.props.match.params.houseId as string) });
      })

  }

  componentDidUpdate() {
    if (parseInt(this.props.match.params.houseId as string) !== this.state.houseId) {
      this.fetchContent();
    }
  }

  componentDidMount() {
    this.fetchContent()
  }

  getRepresentation(data: string | URL | string[] | null[] | null | undefined): any {
    let dataType: string = typeof data;
    if (data == null) {
      return (<Typography></Typography>);
    }
    if (dataType === "string") {
      if ((data as string).match("anapioficeandfire.com/api/houses/")) {
        let matcher = (data as string).match("houses/(\\d+)");
        if (matcher != null) {
          let shortLink = "/houseDetails/" + matcher[1] + "/" + this.props.match.params.backgroundColor
          return <Link to={shortLink}>House {matcher[1]}</Link>
        } else {
          return (<Typography>{data}</Typography>);
        }

      } else if ((data as string).startsWith("https://")) {
        return <div><a target="_blank" rel="noopener noreferrer" href={data as string}>{data}</a></div>;
      } else {
        return (<Typography>{data}</Typography>)
      }
    } else if (dataType === "object") {
      if (Array.isArray(data)) {
        return ((data as string[]).map((entry) => { return this.getRepresentation(entry) }));
      }
    }
    return <Typography>{data}</Typography>
  }


  render() {
    let data = this.state.data;
    if (!data) {
      return (<div>EMPTY</div>)
    }
    return (
      <Card
        className={"house_detail centered"}
        style={{ backgroundColor: "#" + this.props.match.params.backgroundColor }}>
        <div className="centered">
          <Link to="/">Overview</Link>
          <Typography variant="h3" className="big_header text_shadow">{data.name}</Typography>
          <Table className="details_table">
            <TableBody>
              {(Object.keys(data).map((key, index) => (<TableRow hover={true} key={index}><TableCell align="right" size="medium" className="name_cell">{key.toUpperCase()}</TableCell><TableCell align="left" className="content_cell">{this.getRepresentation(data![key as keyof HouseJsonType])}</TableCell></TableRow>)))}
            </TableBody>
          </Table>
        </div>
      </Card >
    );
  }
}

export default withRouter(HouseDetail);