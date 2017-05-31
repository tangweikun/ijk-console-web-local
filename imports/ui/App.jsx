import React, { Component } from 'react'
import { Meteor } from 'meteor/meteor'

const hospitalList = ['all', 'haidian', 'gaoxueyalianmeng', 'anzhenzhongxin']

export default class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      hospitalIndex: 3,
      doctor: {
        haidian: 0,
        gaoxueyalianmeng: 0,
        anzhenzhongxin: 0,
        all: 0,
      },
      patient: {
        haidian: 0,
        gaoxueyalianmeng: 0,
        anzhenzhongxin: 0,
        all: 0,
      },
      allMeasure: {
        haidian: 0,
        gaoxueyalianmeng: 0,
        anzhenzhongxin: 0,
        all: 0,
      },
      todayMeasure: {
        haidian: 0,
        gaoxueyalianmeng: 0,
        anzhenzhongxin: 0,
        all: 0,
      },
      todayUser: {
        haidian: 0,
        gaoxueyalianmeng: 0,
        anzhenzhongxin: 0,
        all: 0,
      },
      controlRate: {
        haidian: 0,
        gaoxueyalianmeng: 0,
        anzhenzhongxin: 0,
        all: 0,
      },
    }
  }

  componentDidMount() {
    setTimeout(() => this.getData(), 10)
    this.set = setInterval(() => this.getData(), 10000)
  }
  componentWillUnmount() {
    clearInterval(this.set)
  }

  getStyles() {
    const { innerWidth, innerHeight } = window
    let height
    let width
    let percentage
    if (innerWidth / innerHeight > 1920 / 1080) {
      height = innerHeight
      percentage = height / 1080
      width = 1920 * percentage
    } else {
      width = innerWidth
      percentage = width / 1920
      height = 1080 * percentage
    }
    const lineHeight = `${100 * percentage}px`
    return {
      container: {
        width,
        height,
        margin: '0 auto',
        paddingLeft: 70 * percentage,
        paddingTop: 60 * percentage,
        backgroundColor: 'black',
        color: '#ff5200',
        fontFamily: 'Roboto',
      },
      logo: {
        height: 100 * percentage,
        width: 100 * percentage,
        marginLeft: 30 * percentage,
        float: 'left',
      },
      layer1: {
        fontSize: 40 * percentage,
        height: 309 * percentage,
      },
      titleLeft: {
        color: '#ff5200',
        height: 100 * percentage,
        lineHeight,
        marginLeft: 30 * percentage,
        marginRight: 30 * percentage,
        float: 'left',
      },
      titleLight: {
        color: '#ff5200',
        height: 100 * percentage,
        lineHeight,
        marginLeft: 30 * percentage,
        float: 'left',
      },
      titleDark: {
        color: '#ffffff',
        opacity: 0.26,
        height: 100 * percentage,
        lineHeight,
        marginLeft: 30 * percentage,
        float: 'left',
      },
      left: {
        float: 'left',
        width: 886 * percentage,
      },
      center: {
        float: 'left',
        width: 527 * percentage,
        borderLeft: 'solid 1px rgba(255, 255, 255, 0.12)',
        borderRight: 'solid 1px rgba(255, 255, 255, 0.12)',
      },
      right: {
        float: 'left',
      },
      layer2: {
        clear: 'both',
        color: '#ffffff',
        height: 549 * percentage,
      },
      label1: {
        width: 310 * percentage,
        height: 117 * percentage,
        fontSize: 100 * percentage,
        textAlign: 'right',
        display: 'inline-block',
        paddingRight: 29 * percentage,
      },
      label2: {
        height: 80 * percentage,
        width: 72 * percentage,
        fontSize: 24 * percentage,
        display: 'inline-block',
        opacity: 0.26,
      },
      label3: {
        height: 117 * percentage,
        width: 239 * percentage,
        fontSize: 100 * percentage,
        textAlign: 'right',
        display: 'inline-block',
        paddingRight: 29 * percentage,
      },
      label4: {
        height: 80 * percentage,
        width: 96 * percentage,
        fontSize: 24 * percentage,
        display: 'inline-block',
        opacity: 0.26,
      },
      measureQuantity: {
        fontSize: 280 * percentage,
        paddingLeft: 70 * percentage,
        textAlign: 'left',
        height: 328 * percentage,
      },
      smallMeasureQuantity: {
        fontSize: 150 * percentage,
        paddingRight: 130 * percentage,
        textAlign: 'right',
        height: 200 * percentage,
      },
      div5: {
        fontSize: 48 * percentage,
        textAlign: 'left',
        opacity: 0.54,
        paddingLeft: 70 * percentage,
      },
      div6: {
        marginTop: 100 * percentage,
      },
    }
  }

  getData() {
    this.setState({ hospitalIndex: (this.state.hospitalIndex + 1) % 4 })
    const hospital = hospitalList[this.state.hospitalIndex]
    Meteor.call('getAllData', hospital, (err, count) => {
      const { doctor, patient, allMeasure, todayMeasure, todayUser, controlRate } = this.state
      doctor[hospital] = count.doctor
      patient[hospital] = count.patient
      allMeasure[hospital] = count.allMeasure
      todayMeasure[hospital] = count.todayMeasure
      controlRate[hospital] = count.controlRate
      todayUser[hospital] = count.todayUser
      this.setState({ doctor, patient, allMeasure, todayMeasure, todayUser, controlRate })
    })
  }

// format the mumber, such as change '12' to '0012'
  addZero(arr, len) {
    if (arr.length < len) {
      arr.unshift(0)
      return this.addZero(arr, len)
    }
    return arr
  }

// format the number, such as change '0012' to '0,012'
  formatNumber(num) {
    const str = num.toString()
    const arr = [...str]
    let newArr
    if (arr.length < 5) {
      newArr = this.addZero(arr, 4)
      newArr.splice(1, 0, ',')
    } else {
      newArr = this.addZero(arr, 7)
      newArr.splice(1, 0, ',')
      newArr.splice(5, 0, ',')
    }
    return newArr
  }

// get the total measure time,and show as a array
  renderNum() {
    const hospital = hospitalList[this.state.hospitalIndex]
    let num = []
    num = this.formatNumber(this.state.todayMeasure[hospital])
    const arr = []
    let isExist = true
    num.map((a, n) => {
      if (isExist) {
        if (+a > 0) {
          isExist = false
          arr.push(<span key={n}>{a}</span>)
        } else {
          arr.push(<span style={{ opacity: 0.15 }} key={n}>{a}</span>)
        }
      } else {
        arr.push(<span key={n}>{a}</span>)
      }
      return a
    })
    return arr
  }

  renderAll() {
    const styles = this.getStyles()
    const hospital = hospitalList[this.state.hospitalIndex]
    // if the num > 9999, then reduce the fontSize
    const isReduceFont = +this.state.todayMeasure[hospital] > 9999
    return (
      <div style={styles.layer2}>
        <div style={styles.left}>
          <div style={isReduceFont ? styles.smallMeasureQuantity : styles.measureQuantity}>
            {this.renderNum()}
          </div>
          <div style={styles.div5}>患者端当日测量次数，{this.state.controlRate[hospital]}%达标</div>
        </div>
        <div style={styles.center}>
          <div>
            <label style={styles.label1}>{this.state.patient[hospital]}</label>
            <label style={styles.label2}>患者端总人数</label>
          </div>
          <div style={styles.div6}>
            <label style={styles.label1}>{this.state.todayUser[hospital]}</label>
            <label style={styles.label4}>当日测量患者人数</label>
          </div>
          <div style={styles.div6}>
            <label style={styles.label1}>{this.state.allMeasure[hospital]}</label>
            <label style={styles.label4}>患者端 累计测量</label>
          </div>
        </div>
        <div style={styles.right}>
          <label style={styles.label3}>{this.state.doctor[hospital]}</label>
          <label style={styles.label2}>医生端总人数</label>
        </div>
      </div>
    )
  }

  render() {
    const styles = this.getStyles()
    const hospitalIndex = this.state.hospitalIndex
    return (
      <div style={styles.container}>
        <div style={styles.layer1}>
          <img src="/img/iTunesArtwork@2x.png" alt="logo" style={styles.logo} />
          <div style={styles.titleLeft}>iHealth 爱健康实时数据</div>
          <div style={hospitalIndex === 0 ? styles.titleLight : styles.titleDark}>全部</div>
          <div style={hospitalIndex === 1 ? styles.titleLight : styles.titleDark}>海淀医院</div>
          <div style={hospitalIndex === 2 ? styles.titleLight : styles.titleDark}>高血压联盟</div>
          <div style={hospitalIndex === 3 ? styles.titleLight : styles.titleDark}>安贞社区</div>
        </div>
        {this.renderAll()}
      </div>
    )
  }
}
