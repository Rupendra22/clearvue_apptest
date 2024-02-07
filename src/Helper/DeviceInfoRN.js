import DeviceInfo from 'react-native-device-info';

const getSystemVersion = () => DeviceInfo.getSystemVersion();
const getBuildNumber = () => DeviceInfo.getBuildNumber();
const getApplicationName = () => DeviceInfo.getApplicationName();
const getVersion = () => DeviceInfo.getVersion();

module.exports = {
  getSystemVersion,
  getBuildNumber,
  getApplicationName,
  getVersion,
};
