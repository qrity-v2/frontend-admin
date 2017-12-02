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
      key: 'name'
    }, {
      title: 'Время',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (timestamp) => moment.unix(timestamp).format('DD.MM.YYYY (HH:mm)')
    }, {
      title: 'Оценка',
      dataIndex: 'stars',
      key: 'stars',
      render: (stars) => Array(stars).join('★')
    }, {
      title: 'Преимущества/недостатки',
      dataIndex: 'tags',
      key: 'tags',
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
        columns={columns}
        pagination={false}
      />
    )
  }
}
