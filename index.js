const startupDebugger = require('debug')('app:startup');
const dbDebugger = require('debug')('app:db');
const config=require('config');
const Joi = require('joi');
const express = require('express');
const app =express();
const logger =require('./logger');
const helmet= require('helmet');
const morgan = require('morgan');

//console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
//console.log(`app: ${app.get('env')}`);



console.log('Application Name:' + config.get('name'));
console.log('Mail server:' + config.get('mail.host'));
//console.log('Mail Password:' + config.get('mail.password'));


app.use(express.json());
app.use(logger);
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));
app.use(helmet());

if(app.get('env') === 'development'){
        app.use(morgan('tiny'));
        startupDebugger('Morgan enabled');
}
dbDebugger('Connected to Database');
const port = process.env.PORT || 3000;


app.listen(port, ()=>console.log(`Listening on port ${port}...`))

app.use(function(req,res,next){

        console.log('Authenticating');
        next();
});

const courses = [
        {id:1, name:'course1'},
        {id:2, name:'course2'},
        {id:3, name:'course3'},
];
app.get('/', (req,res) =>{

res.send('hello world!!!!');

});
app.get('/api/courses',(req,res)=>{

        res.send(courses);
});



app.post('/api/courses',(req,res)=>{
        const {error} = validateCourse(req.body);
        if(error)

               return res.status(400).send(error.details[0].message);
                

        const course = {
                id: courses.length + 1,
                name: req.body.name
        };
        courses.push(course);
        res.send(course);
});

app.put('/api/courses/:id',(req,res)=>{

        const course = courses.find(c=> c.id === parseInt(req.params.id));
        if(!course) 
        
        return res.status(404).send('The course does not exist ');

        const { error} = validateCourse(req.body);
        if(error)

                return res.status(400).send(error.details[0].message);

        course.name = req.body.name;
        res.send(course);


});


app.delete('/api/courses/:id',(req,res)=>{
        const course = courses.find(c=> c.id === parseInt(req.params.id));
        if(!course) return res.status(404).send('The course does not exist ');

        const index = courses.indexOf(courses);
        courses.splice(index,1);
        res.send(course);


});

app.get('/api/courses/:id',(req,res)=>{

        const course = courses.find(c=> c.id === parseInt(req.params.id));
        if(!course) return res.status(404).send('The course does not exist ');
        res.send(courses);
});

function validateCourse(course){
        
        const schema = {
                name:Joi.string().min(3).required(),
        };
        
        return Joi.validate(course, schema);
}

const port = process.env.PORT || 3000;
app.listen(port, () =>console.log(`Listening on port ${port}...`));