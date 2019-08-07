const router = require('express').Router();
const db = require('../data/db')

router.post('/', (req, res) => {
    const postContents = req.body;
    
    !postContents.title || !postContents.contents
    ?
    res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
    :
    db.insert(postContents)
        .then(post => {
            res.status(201).json(post)
        })
        .catch(err => {
            res.status(500).json({ errorMessage: "There was an error while saving the post to the database" })
        })
})

router.post('/:id/comments', (req, res) => {
    const id = req.params.id;
    const comment = req.body.comments
    !id
    ?
    res.status(400).json({ errorMessage: "The post with the specified ID does not exist." })
    :
    null;
    
    !comment
    ?
    res.status(400).json({ errorMessage: "Please provide text for the comment." })
    :
    db.findCommentById(id)
        .then(userComments => {
            res.status(201).json(userComments)
        })
        .catch( err => {
            res.status(500).json({errorMessage: "There was an error while saving the comment to the database"})
        })
});

router.get('/', (req, res) => {
    db.find()
    .then(all => {
        res.status(200).json(all);
    })
    .catch(err => {
        res.status(500).json({ errorMessage: "The posts information could not be retrieved." })
    })
})

router.get('/:id', (req, res) => {
    const id = req.params.id;

    !id 
    ?
    res.status.json({ errorMessage: "The post with the specified ID does not exist." })
    :
    db.findById(id)
        .then( post => {
            res.status(200).json(post)
        })
        .catch(err => {
            res.status(500).json({ errorMessage: "The posts information could not be retrieved." })
        })
})

router.get('/:id/comments', (req, res) => {
    const id = req.params.id;
    const comment = req.body.comments;

    !id 
    ?
    res.status(404).json({ errorMessage: "The post with the specified ID does not exist." })
    :
    null;

    comment
    ?
    res.status(500).json({ errorMessage: "The comments information could not be retrieved." })
    :
    null;

    db.findCommentById(id)
        .then(post => {
            res.status(200).json(post)
        })
        .catch(err => {
            res.status(500).json({ errorMessage: "The posts information could not be retrieved." })
        })
})


router.delete('/:id', (req, res) => {
    const id = req.params.id;

    !id 
    ?
    res.status(404).json({ errorMessage: "The post with the specified ID does not exist." })
    :
    db.remove(id)
        .then(postId => {
            res.status(200).json(postId)
        })
        .catch(err => {
            res.status(500).json({ errorMessage: "The posts could not be removed." })
        })
})

router.put('/:id', (req, res) => {
    const id = req.params.id;
    const changes = req.body;

    !id 
    ?
    res.status(404).json({errorMessage: "The post with the specified ID does not exist." })
    :
    !changes.title || !changes.contents
    ?
    res.status(400).json({ errorMessage: 'Please provide title and contents for the post.'})
    :
    db.update(id, changes)
        .then(post => {
            res.status(200).json(post);
        })
        .catch(err => {
            res.status(500).json({ errorMessage: "The post information could not be modified." })
        })
})

//exports default router
module.exports = router;