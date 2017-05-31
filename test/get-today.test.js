import test from 'ava'
import moment from 'moment'

function isUTCToday(inputDate) {
  const date = new Date(inputDate)
  // const isoDate = date.toISOString()
  // const startOfToday = new Date()
  // startOfToday.setHours(0)
  // startOfToday.setMinutes(0)
  // startOfToday.setSeconds(0)
  const utc = moment().utcOffset(8)
  const startOfToday = moment(utc).set({ hour: 0, minute: 0, second: 0 })
  const d = new Date()
  const utcToday = moment(d).utc().zone(+8)
  console.log({ utcToday })
  const endOfToday = new Date()
  endOfToday.setHours(23)
  endOfToday.setMinutes(59)
  endOfToday.setSeconds(59)
  endOfToday.setSeconds(59)

  if (date > startOfToday && date < endOfToday) return true
  return false
}

test('isUTCToday should return true if UTC date is today morning', t => {
  const r = isUTCToday('2016-08-23 17:55:00.621Z')
  t.is(r, true)
})

test('isUTCToday should return true if china date is today morning', t => {
  const r = isUTCToday('Wed Aug 24 2016 1:26:27 GMT+0800')
  t.is(r, true)
})

test('isUTCToday should return true if UTC date is today evening', t => {
  const r = isUTCToday('2016-08-24 5:55:00.621Z')
  t.is(r, true)
})

test('isUTCToday should return true if china date is today evening', t => {
  const r = isUTCToday('Wed Aug 24 2016 13:26:27 GMT+0800')
  t.is(r, true)
})

test('isUTCToday should return false if UTC date is tomorrow', t => {
  const r = isUTCToday('2016-08-24 17:55:00.621Z')
  t.is(r, false)
})

test('isUTCToday should return false if china date is tomorrow', t => {
  const r = isUTCToday('Thu Aug 25 2016 1:26:27 GMT+0800')
  t.is(r, false)
})

test('isUTCToday should return false if UTC date is yesterday', t => {
  const r = isUTCToday('2016-08-23 15:55:00.621Z')
  t.is(r, false)
})

test('isUTCToday should return false if china date is yesterday', t => {
  const r = isUTCToday('Tue Aug 23 2016 15:26:27 GMT+0800')
  t.is(r, false)
})
