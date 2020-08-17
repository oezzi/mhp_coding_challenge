import React from 'react';
import './App.css';
import House from './House';
import { Box, CircularProgress } from '@material-ui/core';
import Pagination from '@material-ui/lab/Pagination';
import axios from "axios";

interface IProps { }

interface entry {
  name: string,
  url: string
}

interface IState {
  entries: entry[],
  page: number,
  currentPage: number,
  pageCount: number,
  loading: boolean
};

export default class HouseOverview extends React.Component<IProps, IState> {

  constructor(props: IProps) {
    super(props)
    this.state = {
      entries: [],
      page: 1,
      currentPage: 1,
      pageCount: 1,
      loading: false
    }
  }

  componentDidUpdate() {
    if (this.state.currentPage !== this.state.page) {
      this.setState({ currentPage: this.state.page })
      this.fetchElements();
    }
  }

  showNextPage() {
    this.setState({ page: (this.state.page + 1) })
  }

  showPreviousPage() {
    this.setState({ page: (this.state.page - 1) })
  }

  paginationChange(event: any, page: number) {
    this.setState({ page: page })
  }

  fetchElements(firstTime: boolean = false) {
    this.setState({ loading: true });
    axios.get("https://anapioficeandfire.com/api/houses", { params: { pageSize: 25, page: this.state.page } })
      .then(res => {
        let links = res.headers.link.split(',').map((item: string) => { return item.split(';').map((i: string) => i.trim()) });
        if (firstTime) {
          links.forEach((element: string[]) => {
            if (element.includes('rel="last"')) {
              let found = element[0].match('page=(\\d+)')
              if (!!found) {
                this.setState({
                  pageCount: Number(found[1]),
                });
              }
            }
          });
        }


        this.setState({
          entries: res.data.map((item: entry) => { return { name: item.name, url: item.url.match('\\d+') } }),
          loading: false
        });
      })

  }


  componentDidMount() {
    this.fetchElements(true);
  }


  render() {
    if (Boolean(this.state.entries)) {

      return (

        <Box className={'centered padding_top'}>
          <div className={'centered sticky'}>
            <Pagination
              count={this.state.pageCount}
              siblingCount={2}
              boundaryCount={1}
              onChange={this.paginationChange.bind(this)}
              size="medium"
              variant="outlined"
              className="pagination_centered"
            ></Pagination>
          </div>
          {!this.state.loading ?
            (this.state.entries.map((item) => { return (<House key={parseInt(item.url)} id={parseInt(item.url)} name={item.name} ></House>) })) :
            (<div><CircularProgress /></div>)
          }
        </Box >

      )
    } else {
      return (
        <div>sorry empty</div>
      )
    }
  }

}