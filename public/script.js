/**
 * Draw Road Network
 */
id = Math.random().toString(36).substring(2, 15);

BACKGROUND_COLOR = 0xe8ebed;
LANE_COLOR = 0x586970;
LANE_BORDER_WIDTH = 1;
LANE_BORDER_COLOR = 0x82a8ba;
LANE_INNER_COLOR = 0xbed8e8;
LANE_DASH = 10;
LANE_GAP = 12;
TRAFFIC_LIGHT_WIDTH = 3;
MAX_TRAFFIC_LIGHT_NUM = 100000;
ROTATE = 90;

CAR_LENGTH = 5;
CAR_WIDTH = 2;
CAR_COLOR = 0xe8bed4;

CAR_COLORS = [0xf2bfd7, // pink
    0xb7ebe4,   // cyan
    0xdbebb7,   // blue
    0xf5ddb5,
    0xd4b5f5];
CAR_COLORS_NUM = CAR_COLORS.length;

NUM_CAR_POOL = 150000;

LIGHT_RED = 0xdb635e;
LIGHT_GREEN = 0x85ee00;

TURN_SIGNAL_COLOR = 0xFFFFFF;
TURN_SIGNAL_WIDTH = 1;
TURN_SIGNAL_LENGTH = 5;

var simulation, roadnet, steps;
var nodes = {};
var edges = {};
var logs;
var gettingLog = false;

let Application = PIXI.Application,
    Sprite = PIXI.Sprite,
    Graphics = PIXI.Graphics,
    Container = PIXI.Container,
    ParticleContainer = PIXI.particles.ParticleContainer,
    Texture = PIXI.Texture,
    Rectangle = PIXI.Rectangle
    ;
let edgeGraphics;
let nodeGraphics;
var controls = new function () {
    this.replaySpeedMax = 1;
    this.replaySpeedMin = 0.01;
    this.replaySpeed = 0.5;
    this.paused = false;
};

var trafficLightsG = {};

var app, viewport, renderer, simulatorContainer, carContainer, trafficLightContainer;
var turnSignalContainer;
var carPool;

var cnt = 0;
var frameElapsed = 0;
var totalStep;

var nodeCarNum = document.getElementById("car-num");
var nodeProgressPercentage = document.getElementById("progress-percentage");
var nodeTotalStep = document.getElementById("total-step-num");
var nodeCurrentStep = document.getElementById("current-step-num");
var nodeSelectedEntity = document.getElementById("selected-entity");

var SPEED = 3, SCALE_SPEED = 1.01;
var LEFT = 37, UP = 38, RIGHT = 39, DOWN = 40;
var MINUS = 189, EQUAL = 187, P = 80;
var LEFT_BRACKET = 219, RIGHT_BRACKET = 221;
var ONE = 49, TWO = 50;
var SPACE = 32;

var keyDown = new Set();

var turnSignalTextures = [];

let pauseButton = document.getElementById("pause");
let nodeCanvas = document.getElementById("simulator-canvas");
let replayControlDom = document.getElementById("replay-control");
let replaySpeedDom = document.getElementById("replay-speed");

let loading = false;
let infoDOM = document.getElementById("info");
let selectedDOM = document.getElementById("selected-entity");

function infoAppend(msg) {
    infoDOM.innerText += "- " + msg + "\n";
}

function infoReset() {
    infoDOM.innerText = "";
}
function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return unescape(r[2]);
    } else {
        return null;
    }
}
mapDataJson = {}
/**
 * Upload files
 */
let ready = false;

let roadnetData = [];
let replayData = [];
let chartData = [];

function handleChooseFile(v, label_dom) {
    return function (evt) {
        let file = evt.target.files[0];
        label_dom.innerText = file.name;
    }
}

function uploadFile(v, file, callback) {
    let reader = new FileReader();
    reader.onloadstart = function () {
        infoAppend("Loading " + file.name);
    };
    reader.onerror = function () {
        infoAppend("Loading " + file.name + "failed");
    }
    reader.onload = function (e) {
        infoAppend(file.name + " loaded");
        v[0] = e.target.result;
        callback();
    };
    try {
        reader.readAsText(file);
    } catch (e) {
        infoAppend("Loading failed");
        console.error(e.message);
    }
}

let debugMode = false;
let chartLog;
let showChart = false;
let chartConainterDOM = document.getElementById("chart-container");
function start() {
    if (loading) return;
    loading = true;
    infoReset();
    let city = GetQueryString('city')
    let type = GetQueryString('type')
    $.get({
        "url": "http://127.0.0.1:8888/roadmap/json?city=" + city + "&type=" + type,
        success: function (resp) {
            mapDataJson = resp;
            simulation = mapDataJson;
            console.log(mapDataJson);
        }
    })
    let after_update = function () {
        infoAppend("drawing roadnet");
        ready = false;
        // document.getElementById("guide").classList.add("d-none");
        hideCanvas();
        controls.paused = false;
        cnt = 0;
        debugMode = true;
        setTimeout(function () {
            // drawRoadnet();
            try {
                drawRoadnet();
            } catch (e) {
                infoAppend("Drawing roadnet failed");
                console.error(e.message);
                loading = false;
                return;
            }
            ready = true;
            loading = false;
            infoAppend("drawed completed");
        }, 200);
    };
    after_update();

}

let RoadnetFileDom = document.getElementById("roadnet-file");
let ReplayFileDom = document.getElementById("replay-file");
let ChartFileDom = document.getElementById("chart-file");
let ID = document.getElementById("search").value;
function get_ID() {
    ID = document.getElementById("search").value;
    if (edges[ID] != undefined) {
        drawEdge(edges[ID], edgeGraphics, '0xd51628')
    } else if (nodes[ID] != undefined) {
        // ??????????????????????????????????????????????????????
        drawNode(nodes[ID], nodeGraphics, '0x30add1')
        drawNode(nodes[ID], nodeGraphics, '0x30add1')
    }
}

document.getElementById("start-btn").addEventListener("click", start);



function initCanvas() {
    app = new Application({
        width: nodeCanvas.offsetWidth,
        height: nodeCanvas.offsetHeight,
        transparent: false,
        backgroundColor: BACKGROUND_COLOR
    });

    nodeCanvas.appendChild(app.view);
    app.view.classList.add("d-none");

    renderer = app.renderer;
    renderer.interactive = true;
    renderer.autoResize = true;

    renderer.resize(nodeCanvas.offsetWidth, nodeCanvas.offsetHeight);
    // app.ticker.add(run);
}

function showCanvas() {
    document.getElementById("spinner").classList.add("d-none");
    app.view.classList.remove("d-none");
}

function hideCanvas() {
    document.getElementById("spinner").classList.remove("d-none");
    app.view.classList.add("d-none");
}

function drawRoadnet() {
    if (simulatorContainer) {
        simulatorContainer.destroy(true);
    }
    app.stage.removeChildren();
    viewport = new Viewport.Viewport({
        screenWidth: window.innerWidth,
        screenHeight: window.innerHeight,
        interaction: app.renderer.plugins.interaction
    });
    viewport
        .drag()
        .pinch()
        .wheel()
        .decelerate();
    app.stage.addChild(viewport);
    simulatorContainer = new Container();
    viewport.addChild(simulatorContainer);
    roadnet = simulation.static;
    console.log(roadnet)
    nodes = [];
    edges = [];
    trafficLightsG = {};

    for (let i = 0, len = roadnet.nodes.length; i < len; ++i) {
        node = roadnet.nodes[i];
        node.point = new Point(transCoord(node.point));
        nodes[node.id] = node;
    }

    for (let i = 0, len = roadnet.edges.length; i < len; ++i) {
        edge = roadnet.edges[i];
        edge.from = nodes[edge.from];
        edge.to = nodes[edge.to];
        for (let j = 0, len = edge.points.length; j < len; ++j) {
            edge.points[j] = new Point(transCoord(edge.points[j]));
        }
        edges[edge.id] = edge;
    }

    /**
     * Draw Map
     */
    trafficLightContainer = new ParticleContainer(MAX_TRAFFIC_LIGHT_NUM, { tint: true });
    let mapContainer, mapGraphics;
    if (debugMode) {
        mapContainer = new Container();
        simulatorContainer.addChild(mapContainer);
    } else {
        mapGraphics = new Graphics();
        simulatorContainer.addChild(mapGraphics);
    }

    for (nodeId in nodes) {
        if (!nodes[nodeId].virtual) {
            if (debugMode) {
                nodeGraphics = new Graphics();
                mapContainer.addChild(nodeGraphics);
            } else {
                nodeGraphics = mapGraphics;
            }
            drawNode(nodes[nodeId], nodeGraphics, LANE_COLOR);
        }
    }
    for (edgeId in edges) {
        if (debugMode) {
            edgeGraphics = new Graphics();
            mapContainer.addChild(edgeGraphics);
        } else {
            edgeGraphics = mapGraphics;
        }
        drawEdge(edges[edgeId], edgeGraphics, LANE_COLOR);
    }
    let bounds = simulatorContainer.getBounds();
    simulatorContainer.pivot.set(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2);
    simulatorContainer.position.set(renderer.width / 2, renderer.height / 2);
    simulatorContainer.addChild(trafficLightContainer);

    /**
     * Settings for Cars
     */
    TURN_SIGNAL_LENGTH = CAR_LENGTH;
    TURN_SIGNAL_WIDTH = CAR_WIDTH / 2;

    var carG = new Graphics();
    carG.lineStyle(0);
    carG.beginFill(0xFFFFFF, 0.8);
    carG.drawRect(0, 0, CAR_LENGTH, CAR_WIDTH);

    let carTexture = renderer.generateTexture(carG);

    let signalG = new Graphics();
    signalG.beginFill(TURN_SIGNAL_COLOR, 0.7).drawRect(0, 0, TURN_SIGNAL_LENGTH, TURN_SIGNAL_WIDTH)
        .drawRect(0, 3 * CAR_WIDTH - TURN_SIGNAL_WIDTH, TURN_SIGNAL_LENGTH, TURN_SIGNAL_WIDTH).endFill();
    let turnSignalTexture = renderer.generateTexture(signalG);

    let signalLeft = new Texture(turnSignalTexture, new Rectangle(0, 0, TURN_SIGNAL_LENGTH, CAR_WIDTH));
    let signalStraight = new Texture(turnSignalTexture, new Rectangle(0, CAR_WIDTH, TURN_SIGNAL_LENGTH, CAR_WIDTH));
    let signalRight = new Texture(turnSignalTexture, new Rectangle(0, CAR_WIDTH * 2, TURN_SIGNAL_LENGTH, CAR_WIDTH));
    turnSignalTextures = [signalLeft, signalStraight, signalRight];


    carPool = [];
    if (debugMode)
        carContainer = new Container();
    else
        carContainer = new ParticleContainer(NUM_CAR_POOL, { rotation: true, tint: true });


    turnSignalContainer = new ParticleContainer(NUM_CAR_POOL, { rotation: true, tint: true });
    simulatorContainer.addChild(carContainer);
    simulatorContainer.addChild(turnSignalContainer);
    for (let i = 0, len = NUM_CAR_POOL; i < len; ++i) {
        //var car = Sprite.fromImage("images/car.png")
        let car = new Sprite(carTexture);
        let signal = new Sprite(turnSignalTextures[1]);
        car.anchor.set(1, 0.5);

        if (debugMode) {
            car.interactive = true;
            car.on('mouseover', function () {
                selectedDOM.innerText = car.name;
                car.alpha = 0.8;
            });
            car.on('mouseout', function () {
                // selectedDOM.innerText = "";
                car.alpha = 1;
            });
        }
        signal.anchor.set(1, 0.5);
        carPool.push([car, signal]);
    }
    showCanvas();

    return true;
}

function appendText(id, text) {
    let p = document.createElement("span");
    p.innerText = text;
    document.getElementById("info").appendChild(p);
    document.getElementById("info").appendChild(document.createElement("br"));
}

var statsFile = "";
var withRange = false;
var nodeStats, nodeRange;

initCanvas();


function transCoord(point) {
    return [point[0], -point[1]];
}

PIXI.Graphics.prototype.drawLine = function (pointA, pointB) {
    this.moveTo(pointA.x, pointA.y);
    this.lineTo(pointB.x, pointB.y);
}

PIXI.Graphics.prototype.drawDashLine = function (pointA, pointB, dash = 16, gap = 8) {
    let direct = pointA.directTo(pointB);
    let distance = pointA.distanceTo(pointB);

    let currentPoint = pointA;
    let currentDistance = 0;
    let length;
    let finish = false;
    while (true) {
        this.moveTo(currentPoint.x, currentPoint.y);
        if (currentDistance + dash >= distance) {
            length = distance - currentDistance;
            finish = true;
        } else {
            length = dash
        }
        currentPoint = currentPoint.moveAlong(direct, length);
        this.lineTo(currentPoint.x, currentPoint.y);
        if (finish) break;
        currentDistance += length;

        if (currentDistance + gap >= distance) {
            break;
        } else {
            currentPoint = currentPoint.moveAlong(direct, gap);
            currentDistance += gap;
        }
    }
};

function drawNode(node, graphics, nodeColor) {
    graphics.beginFill(nodeColor);
    let outline = node.outline;
    for (let i = 0; i < outline.length; i += 2) {
        outline[i + 1] = -outline[i + 1];
        if (i == 0)
            graphics.moveTo(outline[i], outline[i + 1]);
        else
            graphics.lineTo(outline[i], outline[i + 1]);
    }
    graphics.endFill();

    if (debugMode) {
        graphics.hitArea = new PIXI.Polygon(outline);
        graphics.interactive = true;
        graphics.on("mouseover", function () {
            selectedDOM.innerText = node.id;
            graphics.alpha = 0.5;
        });
        graphics.on("mouseout", function () {
            graphics.alpha = 1;
        });
    }

}

function drawEdge(edge, graphics, laneColor) {
    let from = edge.from;
    let to = edge.to;
    let points = edge.points;

    let pointA, pointAOffset, pointB, pointBOffset;
    let prevPointBOffset = null;
    let roadWidth = 0;
    edge.laneWidths.forEach(function (l) {
        roadWidth += l;
    }, 0);

    let coords = [], coords1 = [];

    for (let i = 1; i < points.length; ++i) {
        if (i == 1) {
            pointA = points[0].moveAlongDirectTo(points[1], from.virtual ? 0 : from.width);
            pointAOffset = points[0].directTo(points[1]).rotate(ROTATE);
        } else {
            pointA = points[i - 1];
            pointAOffset = prevPointBOffset;
        }
        if (i == points.length - 1) {
            pointB = points[i].moveAlongDirectTo(points[i - 1], to.virtual ? 0 : to.width);
            pointBOffset = points[i - 1].directTo(points[i]).rotate(ROTATE);
        } else {
            pointB = points[i];
            pointBOffset = points[i - 1].directTo(points[i + 1]).rotate(ROTATE);
        }
        prevPointBOffset = pointBOffset;

        lightG = new Graphics();
        lightG.lineStyle(TRAFFIC_LIGHT_WIDTH, 0xFFFFFF);
        lightG.drawLine(new Point(0, 0), new Point(1, 0));
        lightTexture = renderer.generateTexture(lightG);

        // Draw Traffic Lights
        if (i == points.length - 1 && !to.virtual) {
            edgeTrafficLights = [];
            prevOffset = offset = 0;
            for (lane = 0; lane < edge.nLane; ++lane) {
                offset += edge.laneWidths[lane];
                var light = new Sprite(lightTexture);
                light.anchor.set(0, 0.5);
                light.scale.set(offset - prevOffset, 1);
                point_ = pointB.moveAlong(pointBOffset, prevOffset);
                light.position.set(point_.x, point_.y);
                light.rotation = pointBOffset.getAngleInRadians();
                light.tint = _statusToColor('g');
                edgeTrafficLights.push(light);
                prevOffset = offset;
                trafficLightContainer.addChild(light);
            }
            trafficLightsG[edge.id] = edgeTrafficLights;
        }

        // Draw Roads
        graphics.lineStyle(LANE_BORDER_WIDTH, LANE_BORDER_COLOR, 1);
        graphics.drawLine(pointA, pointB);

        pointA1 = pointA.moveAlong(pointAOffset, roadWidth);
        pointB1 = pointB.moveAlong(pointBOffset, roadWidth);

        graphics.lineStyle(0);
        graphics.beginFill(laneColor);
        coords = coords.concat([pointA.x, pointA.y, pointB.x, pointB.y]);
        coords1 = coords1.concat([pointA1.y, pointA1.x, pointB1.y, pointB1.x]);

        graphics.drawPolygon([pointA.x, pointA.y, pointB.x, pointB.y, pointB1.x, pointB1.y, pointA1.x, pointA1.y]);
        graphics.endFill();

        offset = 0;
        for (let lane = 0, len = edge.nLane - 1; lane < len; ++lane) {
            offset += edge.laneWidths[lane];
            graphics.lineStyle(LANE_BORDER_WIDTH, LANE_INNER_COLOR);
            graphics.drawDashLine(pointA.moveAlong(pointAOffset, offset), pointB.moveAlong(pointBOffset, offset), LANE_DASH, LANE_GAP);
        }

        offset += edge.laneWidths[edge.nLane - 1];

        // graphics.lineStyle(LANE_BORDER_WIDTH, LANE_BORDER_COLOR);
        // graphics.drawLine(pointA.moveAlong(pointAOffset, offset), pointB.moveAlong(pointBOffset, offset));
    }
    if (debugMode) {
        coords = coords.concat(coords1.reverse());
        graphics.interactive = true;
        graphics.hitArea = new PIXI.Polygon(coords);
        graphics.on("mouseover", function () {
            graphics.alpha = 0.5;
            selectedDOM.innerText = edge.id;
            console.log(edge.id);
        });

        graphics.on("mouseout", function () {
            graphics.alpha = 1;
        });
    }
}

function _statusToColor(status) {
    switch (status) {
        case 'r':
            return LIGHT_RED;
        case 'g':
            return LIGHT_GREEN;
        default:
            return 0x808080;
    }
}

function stringHash(str) {
    let hash = 0;
    let p = 127, p_pow = 1;
    let m = 1e9 + 9;
    for (let i = 0; i < str.length; i++) {
        hash = (hash + str.charCodeAt(i) * p_pow) % m;
        p_pow = (p_pow * p) % m;
    }
    return hash;
}

/*
Chart
 */
let chart = {
    max_steps: 3600,
    data: {
        labels: [],
        series: [[]]
    },
    options: {
        showPoint: false,
        lineSmooth: false,
        axisX: {
            showGrid: false,
            showLabel: false
        }
    },
    init: function (title, series_cnt, max_step) {
        document.getElementById("chart-title").innerText = title;
        this.max_steps = max_step;
        this.data.labels = new Array(this.max_steps);
        this.data.series = [];
        for (let i = 0; i < series_cnt; ++i)
            this.data.series.push([]);
        this.chart = new Chartist.Line('#chart', this.data, this.options);
    },
    addData: function (value) {
        for (let i = 0; i < value.length; ++i) {
            this.data.series[i].push(value[i]);
            if (this.data.series[i].length > this.max_steps) {
                this.data.series[i].shift();
            }
        }
        this.chart.update();
    },
    clear: function () {
        for (let i = 0; i < this.data.series.length; ++i)
            this.data.series[i] = [];
    },
    ptr: 0
};
