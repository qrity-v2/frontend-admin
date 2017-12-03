import React, { Component } from 'react'
import moment from 'moment'
import queryString from 'query-string'
import Table from 'antd/lib/table'
import Tag from 'antd/lib/tag'
import Spin from 'antd/lib/spin'
import status from './utils/status'
import json from './utils/json'

export default class App extends Component {
  state = {
    items: [],
    uid: '',
    token: '',
    loading: false,
    bad_request: false
  }

  async componentWillMount () {
    const { uid, token } = queryString.parse(window.location.search)

    if (!(uid && token)) {
      return this.setState({
        bad_request: true
      })
    }

    this.setState({
      loading: true,
      uid,
      token
    })

    try {
      const { result: items } = await fetch('/evotor/report/?' + queryString.stringify({
        uid,
        token
      }))
        .then(status).then(json)

      console.log(items)

      this.setState({ items, loading: false })
    } catch (err) {
      console.error(err)
    }
  }

  render () {
    const { items, loading, bad_request } = this.state

    if (bad_request) {
      return (
        <div
          style={{
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <h1>Не был передан uid & token.</h1>
        </div>
      )
    } if (loading) {
      return (
        <div
          style={{
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Spin />
        </div>
      )
    }

    const columns = [{
      title: 'Сотрудник',
      dataIndex: 'name',
      key: 'name',
      filters: items.map(({ first_name, last_name }) => ({
        text: `${first_name} ${last_name || ''}`,
        value: `${first_name} ${last_name || ''}`
      })),
      onFilter: (value, { name }) => name === value
    }, {
      title: 'Время',
      dataIndex: 'timestamp',
      key: 'timestamp',
      filters: items
        .map(({ timestamp }) => moment.unix(timestamp).format('DD.MM.YYYY'))
        .filter((item, index, array) => array.indexOf(item) === index)
        .map((item) => ({ text: item, value: item })),
      onFilter: (value, { timestamp }) => moment.unix(timestamp).format('DD.MM.YYYY') === value,
      sorter: (a, b) => b.timestamp - a.timestamp,
      render: (timestamp) => moment.unix(timestamp).format('DD.MM.YYYY (HH:mm)')
    }, {
      title: 'Оценка',
      dataIndex: 'stars',
      key: 'stars',
      filters: items
        .sort((a, b) => a.rating - b.rating)
        .map(({ rating }) => Array(rating + 1).join('★'))
        .filter((item, index, array) => array.indexOf(item) === index)
        .map((item) => ({
          text: item,
          value: item
        })),
      onFilter: (value, { stars }) => stars === value.length,
      sorter: (a, b) => b.stars - a.stars,
      render: (stars) => Array(stars + 1).join('★')
    }, {
      title: 'Преимущества/недостатки',
      dataIndex: 'tags',
      key: 'tags',
      filters: items
        .map(({ tags }) => tags)
        .reduce((a, b) => [ ...a, ...b ], [])
        .filter((item, index, array) => array.indexOf(item) === index)
        .map((tag) => ({
          text: tag,
          value: tag
        })),
      onFilter: (value, { tags: { tags } }) => tags.indexOf(value) !== -1,
      sorter: (a, b) => b.tags.tags.length - a.tags.tags.length,
      render: ({ tags, stars }) => tags.map((tag, i) => <Tag style={{ margin: 3 }} color={stars > 3 ? 'green' : 'red'} key={i}>{tag}</Tag>)
    }]

    return (
      <Table
        dataSource={
          items
            .sort((a, b) => b.timestamp - a.timestamp)
            .map(({ first_name, last_name, tags, rating: stars, ...item }, key) => {
              return {
                ...item,
                key,
                stars,
                name: `${first_name} ${last_name || ''}`,
                tags: { tags, stars }
              }
            })
        }
        locale={{
          filterConfirm: 'ОК',
          filterReset: 'отменить',
          emptyText: 'Не найдено'
        }}
        columns={columns}
      />
    )
  }
}
