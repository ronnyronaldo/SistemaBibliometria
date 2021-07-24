import numpy as np
import pandas as pd
import io
from sklearn import preprocessing 
from sklearn.cluster import KMeans
from sklearn.metrics import pairwise_distances_argmin_min
import seaborn as sb
import matplotlib.pyplot as plt
from flask import Flask, request, jsonify, make_response
from controladores.ArticuloController import listaArticulos, listaArticulosMineria, listaArticulosMineriaAnios, listaArticulosMineriaPorAnio, listaArticulosMineriaPorAreaFrascati, listaArticulosMineriaPorAreaUnesco, listaArticulosMineriaPorAreaUnescoYAnioPublicacion, listaArticulosMineriaPorAreaFrascatiYAnioPublicacion
from controladores.DetalleReferenciaController import listaDetalleReferencia, listaDetalleReferenciaPorAnio 
from controladores.DetalleReferenciaController import listaDetalleReferenciaPorAreaFrascati, listaDetalleReferenciaPorAreaUnesco
from controladores.DetalleReferenciaController import listaDetalleReferenciaPorAreaFrascatiYAnioPublicacion, listaDetalleReferenciaPorAreaUnescoYAnioPublicacion
from sklearn.decomposition import PCA
from mpl_toolkits.mplot3d import Axes3D

def clusterAreas(num_cluster):
    respuesta = (listaArticulosMineria()).json
    numeroRegistros = len(respuesta)
    if numeroRegistros < num_cluster:
        return make_response(jsonify("Error"))
    
    dataframe = pd.json_normalize(respuesta)
    
    X = np.array(dataframe[["id_area_unesco","id_area_frascati","orden_autor"]])
    y = np.array(dataframe['anio_publicacion'])
    print(X.shape)

    kmeans = KMeans(n_clusters=num_cluster).fit(X)
    centroids = kmeans.cluster_centers_

    labels = kmeans.predict(X)

    dataframe['KMeans_Clusters'] = labels
    # Getting the values and plotting it
    f1 = dataframe['id_area_unesco'].values
    f2 = dataframe['id_area_frascati'].values

    areas = pd.concat([dataframe[['id_area_unesco']], dataframe[['id_area_frascati']],dataframe['KMeans_Clusters'], dataframe['id_articulo']], axis = 1)
    area = areas.to_json()

    return make_response(jsonify(area))

def clusterAreasPorAnio(anio_publicacion, num_cluster):
    respuesta = (listaArticulosMineriaPorAnio(anio_publicacion)).json
    numeroRegistros = len(respuesta)
    if numeroRegistros < num_cluster:
        return make_response(jsonify("Error"))

    dataframe = pd.json_normalize(respuesta)
    
    X = np.array(dataframe[["id_area_unesco","id_area_frascati","orden_autor"]])
    y = np.array(dataframe['anio_publicacion'])
    print(X.shape)

    kmeans = KMeans(n_clusters=num_cluster).fit(X)
    centroids = kmeans.cluster_centers_

    # Predicting the clusters
    labels = kmeans.predict(X)

    dataframe['KMeans_Clusters'] = labels
    # Getting the values and plotting it
    f1 = dataframe['id_area_unesco'].values
    f2 = dataframe['id_area_frascati'].values

    areas = pd.concat([dataframe[['id_area_unesco']], dataframe[['id_area_frascati']],dataframe['KMeans_Clusters'], dataframe['id_articulo']], axis = 1)
    area = areas.to_json()
    return make_response(jsonify(area))

def clusterMediosPublicacionOrdenAutor(num_cluster):
    respuesta = (listaArticulosMineria()).json
    numeroRegistros = len(respuesta)
    if numeroRegistros < num_cluster:
        return make_response(jsonify("Error"))

    dataframe = pd.json_normalize(respuesta)
    
    X = np.array(dataframe[["id_medio_publicacion","orden_autor"]])
    y = np.array(dataframe['anio_publicacion'])
    print(X.shape)

    kmeans = KMeans(n_clusters=num_cluster).fit(X)
    centroids = kmeans.cluster_centers_

    # Predicting the clusters
    labels = kmeans.predict(X)

    dataframe['KMeans_Clusters'] = labels
    # Getting the values and plotting it
    f1 = dataframe['id_medio_publicacion'].values
    f2 = dataframe['orden_autor'].values

    mediosPublicacionOrden = pd.concat([dataframe[['id_medio_publicacion']], dataframe[['orden_autor']],dataframe['KMeans_Clusters'], dataframe['id_articulo']], axis = 1)
    mediosOrden = mediosPublicacionOrden.to_json()
    
    return make_response(jsonify(mediosOrden))

def clusterMediosPublicacionOrdenAutorPorAnio(anio_publicacion, num_cluster):
    respuesta = (listaArticulosMineriaPorAnio(anio_publicacion)).json
    
    numeroRegistros = len(respuesta)
    if numeroRegistros < num_cluster:
        return make_response(jsonify("Error"))

    dataframe = pd.json_normalize(respuesta)
    
    X = np.array(dataframe[["id_medio_publicacion","orden_autor"]])
    y = np.array(dataframe['anio_publicacion'])
    print(X.shape)

    kmeans = KMeans(n_clusters=num_cluster).fit(X)
    centroids = kmeans.cluster_centers_

    # Predicting the clusters
    labels = kmeans.predict(X)

    dataframe['KMeans_Clusters'] = labels
    # Getting the values and plotting it
    f1 = dataframe['id_medio_publicacion'].values
    f2 = dataframe['orden_autor'].values

    mediosPublicacionOrden = pd.concat([dataframe[['id_medio_publicacion']], dataframe[['orden_autor']],dataframe['KMeans_Clusters'], dataframe['id_articulo']], axis = 1)
    mediosOrden = mediosPublicacionOrden.to_json()
    
    return make_response(jsonify(mediosOrden))

def clusterMediosPublicacionOrdenAutorPorAreaFrascati(id_area_frascati, num_cluster):
    respuesta = (listaArticulosMineriaPorAreaFrascati(id_area_frascati)).json

    numeroRegistros = len(respuesta)
    if numeroRegistros < num_cluster:
        return make_response(jsonify("Error"))

    dataframe = pd.json_normalize(respuesta)
    
    X = np.array(dataframe[["id_medio_publicacion","orden_autor"]])
    y = np.array(dataframe['anio_publicacion'])
    print(X.shape)

    kmeans = KMeans(n_clusters=num_cluster).fit(X)
    centroids = kmeans.cluster_centers_

    # Predicting the clusters
    labels = kmeans.predict(X)

    dataframe['KMeans_Clusters'] = labels
    # Getting the values and plotting it
    f1 = dataframe['id_medio_publicacion'].values
    f2 = dataframe['orden_autor'].values

    mediosPublicacionOrden = pd.concat([dataframe[['id_medio_publicacion']], dataframe[['orden_autor']],dataframe['KMeans_Clusters'], dataframe['id_articulo']], axis = 1)
    mediosOrden = mediosPublicacionOrden.to_json()
    
    return make_response(jsonify(mediosOrden))

def clusterMediosPublicacionOrdenAutorPorAreaUnesco(id_area_unesco, num_cluster):
    respuesta = (listaArticulosMineriaPorAreaUnesco(id_area_unesco)).json

    numeroRegistros = len(respuesta)
    if numeroRegistros < num_cluster:
        return make_response(jsonify("Error"))

    dataframe = pd.json_normalize(respuesta)
    
    X = np.array(dataframe[["id_medio_publicacion","orden_autor"]])
    y = np.array(dataframe['anio_publicacion'])
    print(X.shape)

    kmeans = KMeans(n_clusters=num_cluster).fit(X)
    centroids = kmeans.cluster_centers_

    # Predicting the clusters
    labels = kmeans.predict(X)

    dataframe['KMeans_Clusters'] = labels
    # Getting the values and plotting it
    f1 = dataframe['id_medio_publicacion'].values
    f2 = dataframe['orden_autor'].values

    mediosPublicacionOrden = pd.concat([dataframe[['id_medio_publicacion']], dataframe[['orden_autor']],dataframe['KMeans_Clusters'], dataframe['id_articulo']], axis = 1)
    mediosOrden = mediosPublicacionOrden.to_json()
    
    return make_response(jsonify(mediosOrden))

def clusterMediosPublicacionOrdenAutorPorAreaFrascatiYAnioPublicacion(anio_publicacion, id_area_frascati, num_cluster):
    respuesta = (listaArticulosMineriaPorAreaFrascatiYAnioPublicacion(anio_publicacion, id_area_frascati)).json

    numeroRegistros = len(respuesta)
    if numeroRegistros < num_cluster:
        return make_response(jsonify("Error"))

    dataframe = pd.json_normalize(respuesta)
    
    X = np.array(dataframe[["id_medio_publicacion","orden_autor"]])
    y = np.array(dataframe['anio_publicacion'])
    print(X.shape)

    kmeans = KMeans(n_clusters=num_cluster).fit(X)
    centroids = kmeans.cluster_centers_

    # Predicting the clusters
    labels = kmeans.predict(X)

    dataframe['KMeans_Clusters'] = labels
    # Getting the values and plotting it
    f1 = dataframe['id_medio_publicacion'].values
    f2 = dataframe['orden_autor'].values

    mediosPublicacionOrden = pd.concat([dataframe[['id_medio_publicacion']], dataframe[['orden_autor']],dataframe['KMeans_Clusters'], dataframe['id_articulo']], axis = 1)
    mediosOrden = mediosPublicacionOrden.to_json()
    
    return make_response(jsonify(mediosOrden))

def clusterMediosPublicacionOrdenAutorPorAreaUnescoYAnioPublicacion(anio_publicacion, id_area_unesco, num_cluster):
    respuesta = (listaArticulosMineriaPorAreaUnescoYAnioPublicacion(anio_publicacion, id_area_unesco)).json

    numeroRegistros = len(respuesta)
    if numeroRegistros < num_cluster:
        return make_response(jsonify("Error"))

    dataframe = pd.json_normalize(respuesta)
    
    X = np.array(dataframe[["id_medio_publicacion","orden_autor"]])
    y = np.array(dataframe['anio_publicacion'])
    print(X.shape)

    kmeans = KMeans(n_clusters=num_cluster).fit(X)
    centroids = kmeans.cluster_centers_

    # Predicting the clusters
    labels = kmeans.predict(X)

    dataframe['KMeans_Clusters'] = labels
    # Getting the values and plotting it
    f1 = dataframe['id_medio_publicacion'].values
    f2 = dataframe['orden_autor'].values

    mediosPublicacionOrden = pd.concat([dataframe[['id_medio_publicacion']], dataframe[['orden_autor']],dataframe['KMeans_Clusters'], dataframe['id_articulo']], axis = 1)
    mediosOrden = mediosPublicacionOrden.to_json()
    
    return make_response(jsonify(mediosOrden))


def clusterRevistasRefNumCit(num_cluster):
    respuesta = (listaDetalleReferencia()).json

    numeroRegistros = len(respuesta)
    if numeroRegistros < num_cluster:
        return make_response(jsonify("Error"))

    dataframe = pd.json_normalize(respuesta)
    dataframe.venue = pd.Categorical(dataframe.venue)
    dataframe['revista'] = dataframe.venue.cat.codes
    
    X = np.array(dataframe[["revista","num_citations"]])
    y = np.array(dataframe['pub_year']) 
    print(X.shape)

    kmeans = KMeans(n_clusters=num_cluster).fit(X)
    centroids = kmeans.cluster_centers_

    # Predicting the clusters
    labels = kmeans.predict(X)

    dataframe['KMeans_Clusters'] = labels
    # Getting the values and plotting it
    f1 = dataframe['revista'].values
    f2 = dataframe['num_citations'].values

    revistaNumCit = pd.concat([dataframe[['revista']], dataframe[['num_citations']],dataframe['KMeans_Clusters'], dataframe['id_referencia'], dataframe['venue']], axis = 1)
    revistas = revistaNumCit.to_json()
    
    return make_response(jsonify(revistas))

def clusterRevistasRefNumCitPorAnio(anio_publicacion, num_cluster):
    respuesta = (listaDetalleReferenciaPorAnio(anio_publicacion)).json

    numeroRegistros = len(respuesta)
    if numeroRegistros < num_cluster:
        return make_response(jsonify("Error"))

    dataframe = pd.json_normalize(respuesta)
    dataframe.venue = pd.Categorical(dataframe.venue)
    dataframe['revista'] = dataframe.venue.cat.codes
    
    X = np.array(dataframe[["revista","num_citations"]])
    y = np.array(dataframe['pub_year'])
    print(X.shape)

    kmeans = KMeans(n_clusters=num_cluster).fit(X)
    centroids = kmeans.cluster_centers_

    # Predicting the clusters
    labels = kmeans.predict(X)

    dataframe['KMeans_Clusters'] = labels
    # Getting the values and plotting it
    f1 = dataframe['revista'].values
    f2 = dataframe['num_citations'].values

    revistaNumCit = pd.concat([dataframe[['revista']], dataframe[['num_citations']],dataframe['KMeans_Clusters'], dataframe['id_referencia'], dataframe['venue']], axis = 1)
    revistas = revistaNumCit.to_json()
    
    return make_response(jsonify(revistas))

def clusterRevistasRefNumCitPorAreaFrascati(id_area_frascati, num_cluster):
    respuesta = (listaDetalleReferenciaPorAreaFrascati(id_area_frascati)).json

    numeroRegistros = len(respuesta)
    if numeroRegistros < num_cluster:
        return make_response(jsonify("Error"))

    dataframe = pd.json_normalize(respuesta)
    dataframe.venue = pd.Categorical(dataframe.venue)
    dataframe['revista'] = dataframe.venue.cat.codes
    
    X = np.array(dataframe[["revista","num_citations"]])
    y = np.array(dataframe['pub_year'])
    print(X.shape)

    kmeans = KMeans(n_clusters=num_cluster).fit(X)
    centroids = kmeans.cluster_centers_

    # Predicting the clusters
    labels = kmeans.predict(X)

    dataframe['KMeans_Clusters'] = labels
    # Getting the values and plotting it
    f1 = dataframe['revista'].values
    f2 = dataframe['num_citations'].values

    revistaNumCit = pd.concat([dataframe[['revista']], dataframe[['num_citations']],dataframe['KMeans_Clusters'], dataframe['id_referencia'], dataframe['venue']], axis = 1)
    revistas = revistaNumCit.to_json()
    
    return make_response(jsonify(revistas))

def clusterRevistasRefNumCitPorAreaUnesco(id_area_unesco, num_cluster):
    respuesta = (listaDetalleReferenciaPorAreaUnesco(id_area_unesco)).json

    numeroRegistros = len(respuesta)
    if numeroRegistros < num_cluster:
        return make_response(jsonify("Error"))

    dataframe = pd.json_normalize(respuesta)
    dataframe.venue = pd.Categorical(dataframe.venue)
    dataframe['revista'] = dataframe.venue.cat.codes
    
    X = np.array(dataframe[["revista","num_citations"]])
    y = np.array(dataframe['pub_year'])
    print(X.shape)

    kmeans = KMeans(n_clusters=num_cluster).fit(X)
    centroids = kmeans.cluster_centers_

    # Predicting the clusters
    labels = kmeans.predict(X)

    dataframe['KMeans_Clusters'] = labels
    # Getting the values and plotting it
    f1 = dataframe['revista'].values
    f2 = dataframe['num_citations'].values

    revistaNumCit = pd.concat([dataframe[['revista']], dataframe[['num_citations']],dataframe['KMeans_Clusters'], dataframe['id_referencia'], dataframe['venue']], axis = 1)
    revistas = revistaNumCit.to_json()
    
    return make_response(jsonify(revistas))

def clusterRevistasRefNumCitPorAreFraYAniPub(anio_publicacion, id_area_frascati, num_cluster):
    respuesta = (listaDetalleReferenciaPorAreaFrascatiYAnioPublicacion(anio_publicacion, id_area_frascati)).json

    numeroRegistros = len(respuesta)
    if numeroRegistros < num_cluster:
        return make_response(jsonify("Error"))

    dataframe = pd.json_normalize(respuesta)
    dataframe.venue = pd.Categorical(dataframe.venue)
    dataframe['revista'] = dataframe.venue.cat.codes
    
    X = np.array(dataframe[["revista","num_citations"]])
    y = np.array(dataframe['pub_year'])
    print(X.shape)

    kmeans = KMeans(n_clusters=num_cluster).fit(X)
    centroids = kmeans.cluster_centers_

    # Predicting the clusters
    labels = kmeans.predict(X)

    dataframe['KMeans_Clusters'] = labels
    # Getting the values and plotting it
    f1 = dataframe['revista'].values
    f2 = dataframe['num_citations'].values

    revistaNumCit = pd.concat([dataframe[['revista']], dataframe[['num_citations']],dataframe['KMeans_Clusters'], dataframe['id_referencia'], dataframe['venue']], axis = 1)
    revistas = revistaNumCit.to_json()
    return make_response(jsonify(revistas))

def clusterRevistasRefNumCitPorAreUneYAniPub(anio_publicacion, id_area_unesco, num_cluster):
    respuesta = (listaDetalleReferenciaPorAreaUnescoYAnioPublicacion(anio_publicacion, id_area_unesco)).json

    numeroRegistros = len(respuesta)
    if numeroRegistros < num_cluster:
        return make_response(jsonify("Error"))

    dataframe = pd.json_normalize(respuesta)
    dataframe.venue = pd.Categorical(dataframe.venue)
    dataframe['revista'] = dataframe.venue.cat.codes
    
    X = np.array(dataframe[["revista","num_citations"]])
    y = np.array(dataframe['pub_year'])
    print(X.shape)

    kmeans = KMeans(n_clusters=num_cluster).fit(X)
    centroids = kmeans.cluster_centers_

    # Predicting the clusters
    labels = kmeans.predict(X)

    dataframe['KMeans_Clusters'] = labels
    # Getting the values and plotting it
    f1 = dataframe['revista'].values
    f2 = dataframe['num_citations'].values

    revistaNumCit = pd.concat([dataframe[['revista']], dataframe[['num_citations']],dataframe['KMeans_Clusters'], dataframe['id_referencia'], dataframe['venue']], axis = 1)
    revistas = revistaNumCit.to_json()
    
    return make_response(jsonify(revistas))
    



