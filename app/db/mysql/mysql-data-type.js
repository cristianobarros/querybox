
const Types = require('electron').remote.require('mysql').Types;

export default {
    [Types.DATE]: 'date',
    [Types.DATETIME]: 'timestamp',
    [Types.TIMESTAMP]: 'timestamp',
};
