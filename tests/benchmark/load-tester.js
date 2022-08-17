import http from 'k6/http';
import { sleep } from 'k6';
import { Trend, Rate } from 'k6/metrics';

const postPayload = `{
    _id: '62fa714780cfc10b0abdf25b',
    index: 0,
    guid: 'f9fd0bcf-2a95-4e93-9403-ca543890c955',
    isActive: true,
    balance: '$2,299.82',
    picture: 'http://placehold.it/32x32',
    age: 21,
    eyeColor: 'blue',
    name: 'Jenifer Griffin',
    gender: 'female',
    company: 'ZAPHIRE',
    email: 'jenifergriffin@zaphire.com',
    phone: '+1 (866) 426-2947',
    address: '172 Will Place, Albrightsville, Virgin Islands, 7893',
    about: 'Consectetur irure exercitation aute ipsum do velit veniam. Irure ullamco anim nisi magna nulla laboris enim nisi. Dolore non tempor est minim reprehenderit consectetur. Magna incididunt sunt occaecat veniam nulla consectetur.\r\n',
    registered: '2018-03-22T07:07:20 +03:00',
    latitude: 14.088846,
    longitude: -25.686357,
    tags: ['aute', 'est', 'in', 'sit', 'eiusmod', 'Lorem', 'voluptate'],
    friends: [
        {
            id: 0,
            name: 'Robbins Rosa',
        },
        {
            id: 1,
            name: 'Camacho Wiggins',
        },
        {
            id: 2,
            name: 'George Jefferson',
        },
    ],
    greeting: 'Hello, Jenifer Griffin! You have 9 unread messages.',
    favoriteFruit: 'apple',
}`;

// Thresholds (Limites) para o endpoint get-user
export const getErrorRate = new Rate('get_error_rate');
export const getSuccessRate = new Rate('get_success_rate');
export const getRequestDuration = new Trend('get_request_duration');

// Thresholds (Limites) para o endpoint get-user
export const postErrorRate = new Rate('post_error_rate');
export const postSuccessRate = new Rate('post_success_rate');
export const postRequestDuration = new Trend('post_request_duration');

// Os stages são os estágios do nosso teste de carga
// Os estágio levam duas opções: target e duration
// target significa o número de VU'S (Virtual User's)
// duration: O tempo pelo qual serão executadas as requisições desde estágio
// Com isso estamos simulando cenários reais de requisições
// neste caso começamos com 10 requisições por segundo

export const options = {
    stages: [
        { target: 10, duration: '10s' },
        { target: 20, duration: '10s' },
        { target: 300, duration: '20s' },
    ],

    thresholds: {
        // thresholds (limites) para o endpoint / with GET
        getRequest: ['p(99)<30', 'p(80)<150', 'avg<20'],
        getErrorRate: ['rate <= 0.0'],
        getSuccessRate: ['rate>1.00'],

        // thresholds (limites) para o endpoint / with POST
        postRequest: ['p(99) < 30', 'p(80)<150', 'avg<20'],
        postErrorRate: ['rate <= 0.0'],
        postSuccessRate: ['rate > 1.00'],
    },
};

// Endpoints da nossa api que serão testados

const serverHost = 'localhost';
const serverPort = 3000;

const serverEndpoint = `http://${serverHost}:${serverPort}/`;

export default function () {
    // Testando o endpoint / com GET
    const getResponse = http.get(serverEndpoint);

    getRequestDuration.add(getResponse.timings.duration);

    switch (getResponse.status) {
        case 200: {
            getSuccessRate.add(1);
            break;
        }
        default: {
            getErrorRate.add(1);
        }
    }

    // Testando o endpoint / com post

    const postResponse = http.post(serverEndpoint, postPayload);

    postRequestDuration.add(postResponse.timings.duration);

    switch (postResponse.status) {
        case 201: {
            postSuccessRate.add(1);
            break;
        }
        default: {
            postErrorRate.add(1);
        }
    }

    sleep(1);
}
