const express = require('express');
const moment = require('moment');
const router = express.Router();
const { downloadVideo, listFormats } = require('../controllers/youtubedlController');


router.get('/', (req, res, next) => {
    try {
        res.render('index')
    } catch (err) {
        next(err);
    }
});

router.post('/ytdl', async (req, res) => {
    const videoUrl = req.body.videoUrl;

    if (!videoUrl) {
        res.status(400).send({ error: 'videoUrl is required' });
        return;
    }

    try {
        await downloadVideo(videoUrl);
        res.status(200).send({ success: 'Video download started' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Error starting video download' });
    }
});

router.post('/format', async (req, res) => {
    const videoUrl = req.body.videoUrl;

    if (!videoUrl) {
        res.status(400).send({ error: 'videoUrl is required' });
        return;
    }

    try {
        const info = await listFormats(videoUrl);
        res.status(200).send({ info: info });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Error starting video download' });
    }
});


module.exports = router;

