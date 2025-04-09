const { getReportSummary } = require('../controllers/AdminReportController');

const router=require('express').Router()

router.get('/admin/report-summary', getReportSummary);

module.exports=router