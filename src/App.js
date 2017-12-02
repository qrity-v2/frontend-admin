import React, { Component } from 'react'
import moment from 'moment'
import Table from 'antd/lib/table'
import Tag from 'antd/lib/tag'
import Spin from 'antd/lib/spin'

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export default class App extends Component {
  state = {
    items: [],
    loading: false
  }

  async componentWillMount () {
    this.setState({ loading: true })

    const { result: items } = {
      "result": [
        {
          "user_id": "20171202-7A01-4024-80A9-1722C36BCB5C",
          "store_id": "20171202-ED8A-4098-8080-9D2FCCCBFB01",
          "first_name": "Петя",
          "last_name": "Иванов",
          "phone": "8 800 555 35 55",
          "rating": 3,
          "tags": [
            "плохо",
            "не вкусно"
          ],
          "text": "ну пиздец",
          "timestamp": 1512222456
        },
        {
          "user_id": "20171202-7A01-4024-80A9-1722C36BCB5A",
          "store_id": "20171202-ED8A-4098-8080-9D2FCCCBFB02",
          "first_name": "Василий",
          "last_name": null,
          "phone": null,
          "rating": 5,
          "tags": [
            "круто"
          ],
          "text": null,
          "timestamp": 1512222567
        },
        {
          "user_id": "20171202-7A01-4024-80A9-1722C36BCB5A",
          "store_id": "20171202-ED8A-4098-8080-9D2FCCCBFB02",
          "first_name": "Михаил",
          "last_name": null,
          "phone": null,
          "rating": 1,
          "tags": [
            "плохо",
            "тупой",
            "козел"
          ],
          "text": null,
          "timestamp": 1512496205
        }
      ]
    }

    await sleep(1500) // demo for load...

    this.setState({ items, loading: false })
  }

  render () {
    const { items, loading } = this.state

    if (loading) {
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
        .map(({ rating }) => ({
          text: Array(rating + 1).join('★'),
          value: Array(rating + 1).join('★')
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
      render: ({ tags, stars }) => tags.map((tag, i) => <Tag color={stars > 3 ? 'green' : 'red'} key={i}>{tag}</Tag>)
    }]

    return (
      <Table
        dataSource={
          items.map(({ first_name, last_name, tags, rating: stars, ...item }, key) => {
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
        pagination={false}
      />
    )
  }
}
