const STORAGE_RECORDS_KEY = 'attendance_records';
const STORAGE_STUDENTS_KEY = 'registeredStudents';

export const loadAttendanceRecords = () => {
  const stored = localStorage.getItem(STORAGE_RECORDS_KEY);
  if (!stored) return [];
  try {
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed.map(normalizeRecord) : [];
  } catch (error) {
    console.error('Unable to parse attendance records', error);
    return [];
  }
};

export const loadRegisteredStudents = () => {
  const stored = localStorage.getItem(STORAGE_STUDENTS_KEY);
  if (!stored) return [];
  try {
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Unable to parse registered students', error);
    return [];
  }
};

const normalizeRecord = (record) => {
  if (!record) return record;

  const normalized = { ...record };
  if (!normalized.timestamp) {
    const timestamp = record.isoTimestamp
      ? new Date(record.isoTimestamp)
      : record.time
        ? parseTimeString(record.time)
        : new Date();

    normalized.timestamp = timestamp.toISOString();
  }

  if (!normalized.date) {
    normalized.date = new Date(normalized.timestamp).toLocaleDateString();
  }

  if (!normalized.time) {
    normalized.time = new Date(normalized.timestamp).toLocaleTimeString();
  }

  return normalized;
};

const parseTimeString = (timeString) => {
  const [hours, minutes, seconds] = timeString.split(':').map((part) => Number(part));
  const now = new Date();
  now.setHours(Number.isFinite(hours) ? hours : 0, Number.isFinite(minutes) ? minutes : 0, Number.isFinite(seconds) ? seconds : 0, 0);
  return now;
};

export const getAttendanceStats = (records, registeredStudents) => {
  const totalStudents = registeredStudents.length;
  const today = new Date().toLocaleDateString();
  const todaysRecords = records.filter((record) => record.date === today);
  const uniquePresent = new Set(todaysRecords.map((record) => record.student));
  const presentToday = uniquePresent.size;
  const lateArrivals = todaysRecords.filter((record) => String(record.status).toUpperCase().includes('LATE')).length;
  const blockchainLogs = records.length;

  const attendanceRate = totalStudents > 0 ? Math.round((presentToday / totalStudents) * 100) : 0;
  const attendanceSubtitle = totalStudents > 0 ? `${attendanceRate}% attendance rate` : 'No students registered';
  const lateSubtitle = lateArrivals > 0 ? `${lateArrivals} late today` : 'No late arrivals';
  const logsSubtitle = `${blockchainLogs} records stored`;

  return {
    totalStudents,
    presentToday,
    lateArrivals,
    blockchainLogs,
    attendanceSubtitle,
    lateSubtitle,
    logsSubtitle,
  };
};

export const aggregateWeeklyAttendance = (records) => {
  const now = new Date();
  const last7Days = Array.from({ length: 7 }).map((_, index) => {
    const day = new Date(now);
    day.setDate(now.getDate() - (6 - index));
    return {
      label: day.toLocaleDateString(undefined, { weekday: 'short' }),
      key: day.toISOString().slice(0, 10),
      count: 0,
    };
  });

  const counts = {};
  records.forEach((record) => {
    const iso = record.timestamp ? record.timestamp.slice(0, 10) : record.date ? new Date(record.date).toISOString().slice(0, 10) : null;
    if (!iso) return;
    counts[iso] = counts[iso] || new Set();
    counts[iso].add(record.student);
  });

  return last7Days.map((day) => ({
    day: day.label,
    count: counts[day.key] ? counts[day.key].size : 0,
  }));
};

export const aggregateArrivalHours = (records) => {
  const hourlyBuckets = [
    '8 AM', '9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM'
  ].map((label) => ({ hour: label, count: 0 }));

  const parseHour = (record) => {
    if (record.timestamp) {
      return new Date(record.timestamp).getHours();
    }

    if (record.time) {
      const [h] = record.time.split(':').map((value) => Number(value));
      return Number.isFinite(h) ? h : null;
    }

    return null;
  };

  records.forEach((record) => {
    const hour = parseHour(record);
    if (hour === null) return;
    const mappedHour = hour === 12 ? '12 PM' : hour === 0 ? '12 AM' : hour > 12 ? `${hour - 12} PM` : `${hour} AM`;
    const bucket = hourlyBuckets.find((bucket) => bucket.hour === mappedHour);
    if (bucket) bucket.count += 1;
  });

  return hourlyBuckets;
};
