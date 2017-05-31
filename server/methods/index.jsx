import { Meteor } from 'meteor/meteor'
import { Measure, Users } from '../../imports/lib/collections.jsx'
import moment from 'moment'

const $in = ['haidian', 'gaoxueyalianmeng', 'anzhenzhongxin']

// return the patient's '_id' as a array
function getPatientIdList(source) {
  const patientIdList = []
  const roles = 'patient'
  let patientList
  if (source === 'all') {
    patientList = Users.find({
      roles,
      'profile.source': {
        $nin: ['development', 'develop2', 'shiyong', 'default']
      },
      'profile.isDeleted': { $ne: true },
    }).fetch()
  } else {
    patientList = Users.find({
      roles,
      'profile.source': source,
      'profile.isDeleted': { $ne: true },
    }).fetch()
  }
  Array.from(patientList).forEach((p) => {
    patientIdList.push(p._id)
  })
  return patientIdList
}

// get the doctor's quantity
function getDoctorNum(source) {
  const roles = 'doctor'
  if (source === 'all') {
    return Users.find({
      roles,
      'profile.source': {
        $nin: ['development', 'develop2', 'shiyong', 'default']
      },
      'profile.isDeleted': { $ne: true },
    }).count()
  }
  return Users.find({
    roles,
    'profile.source': source,
    'profile.isDeleted': { $ne: true },
  }).count()
}

export default function () {
  Meteor.methods({
    'getAllData'(source) {
      const chinaDate = moment().utcOffset(8)
      const today = new Date(moment(chinaDate).set({ hour: 0, minute: 0, second: 0 }))
      const todayUserIdList = []
      let controlRate = 0
      const patientIdList = getPatientIdList(source)
      const todayUserList = Measure.find({
        createdAt: { $gte: today },
        patientId: { $in: patientIdList },
      }).fetch()
      Array.from(todayUserList).forEach((p) => {
        todayUserIdList.push(p.patientId)
      })
      const controlMeasure = Measure.find({
        createdAt: { $gte: today },
        patientId: { $in: patientIdList },
        HP: { $lt: 135 },
        LP: { $lt: 85 },
      }).count()
      const doctor = getDoctorNum(source)
      const patient = patientIdList.length
      const allMeasure = Measure.find({ patientId: { $in: patientIdList } }).count()
      const todayMeasure = Measure.find({
        createdAt: { $gte: today },
        patientId: { $in: patientIdList },
      }).count()
      const todayUser = [...new Set(todayUserIdList)].length
      if (todayMeasure) {
        controlRate = parseFloat(parseFloat(100 * (controlMeasure / todayMeasure)).toPrecision(2))
      }
      const obj = { doctor, patient, allMeasure, todayMeasure, todayUser, controlRate }
      return obj
    },
  })
}
