from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import aiohttp
import asyncio
import random
import logging 
import pprint
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)
   
logger = logging.getLogger(__name__) 
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s', datefmt='%d:%m:%Y %H:%M:%S:%f')



async def get_distance(from_node, to_node, source, destination):
    if from_node['title'] == source and to_node['title'] == destination:
        return 99999
    origin = f"{from_node['latlng']['latitude']},{from_node['latlng']['longitude']}"
    destination = f"{to_node['latlng']['latitude']},{to_node['latlng']['longitude']}"

    api_key = "AIzaSyA0P4DLkwK2kdikcnu8NPS69mvYfwjCQ_E"

    url = f"https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins={origin}&destinations={destination}&mode=walking&key={api_key}"

    async with aiohttp.ClientSession() as session:
        async with session.get(url) as response:
            data = await response.json()
    try:
        distance = data["rows"][0]["elements"][0]["distance"]["value"]
    except KeyError as e:
        print(e)
        print(data)
        distance = 1
    
    return distance

async def build_graph(data, source, destination):
    graph = [[0 for _ in range(len(data))] for _ in range(len(data))]
    for index, each_node in enumerate(data):
        for inner_index, each_inner_node in enumerate(data):
            if index == inner_index:
                graph[index][inner_index] = {"from_id": each_node["id"], "to_id": each_inner_node["id"], "value": 0, "from": each_node['title'], "to": each_inner_node['title'], "via": each_inner_node['title'], "latlng": each_node['latlng']}
            else:
                graph[index][inner_index] = {"from_id": each_node["id"], "to_id": each_inner_node["id"], "value": await get_distance(each_node, each_inner_node, source, destination), "from": each_node['title'], "to": each_inner_node['title'], "via": "", "latlng": each_node['latlng']}
    return graph

async def floyd_warshall(data, source, destination):
    graph = await build_graph(data, source, destination)
    for k in range(len(graph)):
        for i in range(len(graph)):
            for j in range(len(graph)):
                if graph[i][j]["value"] > graph[i][k]["value"] + graph[k][j]["value"]:
                    graph[i][j]["value"] = graph[i][k]["value"] + graph[k][j]["value"]
                    graph[i][j]["via"] = graph[k][j]["from"]
                    graph[i][j]["latlng"] = graph[k][j]["latlng"]
    return graph

async def just_floyd_warshall(graph, source, destination):
    for k in range(len(graph)):
        for i in range(len(graph)):
            for j in range(len(graph)):
                if graph[i][j]["value"] > graph[i][k]["value"] + graph[k][j]["value"]:
                    graph[i][j]["value"] = graph[i][k]["value"] + graph[k][j]["value"]
                    graph[i][j]["via"] = graph[k][j]["from"]
    return graph

async def best_node(data):
    # sources = []
    source = data[-2]["title"]
    destination = data[-1]["title"]
    graph = await floyd_warshall(data, source, destination)
    for _, each_node in enumerate(graph):
        for _, each_inner_node in enumerate(each_node):
            if each_inner_node["from"] == source and each_inner_node["to"] == destination:
                # if each_inner_node["via"] == destination:
                #     each_inner_node["via"] = random.choice(sources)
                #     print(f"Randomly selected {each_inner_node['via']} as via")
                #     sources.remove(each_inner_node["via"])
                    return {"node": each_inner_node, "fwmatrix": graph}
            # else:
            #     sources.append(each_inner_node["from"])
    return "No Path found"
    
@app.get('/test')
async def test():
    graph = [[{'from': 'A', 'to': 'A', 'value': 0, 'via': 'A'},
  {'from': 'A', 'to': 'B', 'value': 5, 'via': ''},
  {'from': 'A', 'to': 'C', 'value': 99999, 'via': ''},
  {'from': 'A', 'to': 'D', 'value': 10, 'via': ''}],
 [{'from': 'B', 'to': 'A', 'value': 99999, 'via': ''},
  {'from': 'B', 'to': 'B', 'value': 0, 'via': 'B'},
  {'from': 'B', 'to': 'C', 'value': 3, 'via': ''},
  {'from': 'B', 'to': 'D', 'value': 98999, 'via': ''}],
 [{'from': 'C', 'to': 'A', 'value': 99999, 'via': ''},
  {'from': 'C', 'to': 'B', 'value': 99999, 'via': ''},
  {'from': 'C', 'to': 'C', 'value': 0, 'via': 'C'},
  {'from': 'C', 'to': 'D', 'value': 1, 'via': ''}],
 [{'from': 'D', 'to': 'A', 'value': 99999, 'via': ''},
  {'from': 'D', 'to': 'B', 'value': 99999, 'via': ''},  
  {'from': 'D', 'to': 'C', 'value': 99999, 'via': ''},
  {'from': 'D', 'to': 'D', 'value': 0, 'via': 'D'}]]
    result = await just_floyd_warshall(graph)
    return result

@app.get('/')
async def root():
    return {'message': 'Hello World'}

@app.post('/getBestWayPoint')
async def get_best_way_point(request: Request):
    result = await request.json()
    logger.info(f" Got Paylßoad")
    best_way_point = await best_node(result['data'])
    return best_way_point

@app.post('/getFWMatrix')
async def get_fw_matrix(request: Request):
    result = await request.json()
    logger.info(f" Got Payload {result = }")
    fw_matrix = await floyd_warshall(result['data'], result["data"][-2]["title"], result["data"][-1]["title"])
    logger.info(f"{fw_matrix = }")
    return fw_matrix

if __name__ == '__main__':
    import uvicorn
    uvicorn.run("main:app", host='0.0.0.0', port=8000, reload=True)