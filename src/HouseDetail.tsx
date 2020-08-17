import React from 'react';
import { Link, withRouter, RouteComponentProps } from "react-router-dom";
import axios from "axios";
import { Card, Table, TableBody, TableCell, TableRow, Typography, CircularProgress } from '@material-ui/core';
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
    if (parseInt(this.props.match.params.houseId as string) !== this.state.houseId && this.state.data !== undefined) {
      this.setState({ data: undefined })
      this.fetchContent();
    }
  }

  componentDidMount() {
    this.fetchContent()
  }

  getRepresentation(data: string | URL | string[] | null[] | null | undefined,
    index: number): any {
    let dataType: string = typeof data;
    if (data == null) {
      return (<Typography></Typography>);
    }
    if (dataType === "string") {
      if ((data as string).match("anapioficeandfire.com/api/houses/")) {
        let matcher = (data as string).match("houses/(\\d+)");
        if (matcher != null) {
          let shortLink = "/houseDetails/" + matcher[1] + "/" + this.props.match.params.backgroundColor
          return <Link key={index} to={shortLink}>House {matcher[1]}</Link>
        } else {
          return (<Typography key={index}>{data}</Typography>);
        }

      } else if ((data as string).startsWith("https://")) {
        return <div key={index}><a target="_blank" rel="noopener noreferrer" href={data as string}>{data}</a></div>;
      } else {
        return (<Typography key={"data_" + index}>{data}</Typography>)
      }
    } else if (dataType === "object") {
      if (Array.isArray(data)) {
        return ((data as string[]).map((entry, newIndex) => { return this.getRepresentation(entry, index + (newIndex * 100)) }));
      }
    }
    return <Typography>{data}</Typography>
  }


  render() {
    let data = this.state.data;
    if (!data) {
      return (
        <Card
          className={"house_detail centered"}
          style={{ backgroundColor: "#" + this.props.match.params.backgroundColor }}>
          <div className="centered">
            <CircularProgress />
          </div>
        </Card>
      )
    }
    return (
      <Card
        className={"house_detail centered"}
        style={{ backgroundColor: "#" + this.props.match.params.backgroundColor }}>
        <div className="centered">
          <div className="left">
            <Link className="link_button" to="/">&lt; Back to Overview</Link>
          </div>
          <Typography variant="h3" className="big_header text_shadow">{data.name}</Typography>
          <Table className="details_table">
            <TableBody>
              {(Object.keys(data).map((key, index) => (<TableRow hover={true} key={"row_" + index}><TableCell key={index + "_1"} align="right" size="medium" className="name_cell">{key.toUpperCase()}</TableCell><TableCell key={index + "_2"} align="left" className="content_cell">{this.getRepresentation(data![key as keyof HouseJsonType], index)}</TableCell></TableRow>)))}
            </TableBody>
          </Table>
        </div>
      </Card >
    );
  }
}

export default withRouter(HouseDetail);