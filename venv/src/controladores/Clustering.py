import numpy as np
import pandas as pd
import io
from sklearn import preprocessing 
from sklearn.cluster import KMeans
from sklearn.metrics import pairwise_distances_argmin_min
import seaborn as sb
import matplotlib.pyplot as plt
from flask import Flask, request, jsonify, make_response
from controladores.ArticuloController import listaArticulos, listaArticulosMineria, listaArticulosMineriaAnios, listaArticulosMineriaPorAnio
from controladores.DetalleReferenciaController import listaDetalleReferencia 
from sklearn.decomposition import PCA
from mpl_toolkits.mplot3d import Axes3D


def ejecutar():
    respuesta = (listaArticulosMineria()).json
    df = pd.io.json.json_normalize(respuesta)
    areas_norm = (df-df.min())/(df.max()-df.min())
    wcss = []
    # wcss es un indicador de que tan similares son los individuos dentro de los clusters
    for i in range(1,21):
        kmeans = KMeans(n_clusters = i, max_iter = 300)
        kmeans.fit(areas_norm)
        wcss.append(kmeans.inertia_)
    clustering = KMeans(n_clusters = 6, max_iter=300) # se crea el modelo
    clustering.fit(areas_norm) #Aplica el modelo a mis datos
    df['KMeans_Clusters'] = clustering.labels_ # Los resultados del clustering se guardan en lables_ dentro del modelo
    df.head()

    pca = PCA(n_components = 2)
    pca_areas = pca.fit_transform(areas_norm)
    pca_areas_df = pd.DataFrame(data = pca_areas, columns = ['Componente_1','Componente_2'])
    pca_nombres_areas = pd.concat([pca_areas_df, df[['KMeans_Clusters']]], axis = 1)
    
    valorClustering = df.to_json()
    return make_response(jsonify(valorClustering))

def ejecutarAnios():
    print("ejecutando años")
    respuesta = (listaArticulosMineriaAnios()).json
    df = pd.io.json.json_normalize(respuesta)
    titulo = df.drop(['anio_publicacion'],1) 
    df = df.drop(['titulo'],1) 
    areas_norm = (df-df.min())/(df.max()-df.min())
    wcss = []
    # wcss es un indicador de que tan similares son los individuos dentro de los clusters
    for i in range(1,21):
        kmeans = KMeans(n_clusters = i, max_iter = 300)
        kmeans.fit(areas_norm)
        wcss.append(kmeans.inertia_)
    clustering = KMeans(n_clusters = 6, max_iter=300) # se crea el modelo
    clustering.fit(areas_norm) #Aplica el modelo a mis datos
    df['KMeans_Clusters'] = clustering.labels_ # Los resultados del clustering se guardan en lables_ dentro del modelo
    df.head()
    pca_titulo_anio = pd.concat([df[['anio_publicacion']],titulo, df[['KMeans_Clusters']]], axis = 1)
    valorClustering = pca_titulo_anio.to_json()
    return make_response(jsonify(valorClustering))

def clusterAreas(num_cluster):
    respuesta = (listaArticulosMineria()).json
    dataframe = pd.io.json.json_normalize(respuesta)
    
    X = np.array(dataframe[["id_area_unesco","id_area_frascati","orden_autor"]])
    y = np.array(dataframe['anio_publicacion'])
    print(X.shape)

    kmeans = KMeans(n_clusters=num_cluster).fit(X)
    centroids = kmeans.cluster_centers_

    labels = kmeans.predict(X)

    # Getting the cluster centers
    #C = kmeans.cluster_centers_
    #colores=['red','green','blue','cyan','yellow','pink','purple']
    #asignar=[]
    #for row in labels:
    #    asignar.append(colores[row])

    # fig = plt.figure()
    # ax = Axes3D(fig)
    # ax.scatter(X[:, 0], X[:, 1], X[:, 2], c=asignar,s=60)
    # ax.scatter(C[:, 0], C[:, 1], C[:, 2], marker='*', c=colores, s=1000)
    dataframe['KMeans_Clusters'] = labels
    # Getting the values and plotting it
    f1 = dataframe['id_area_unesco'].values
    f2 = dataframe['id_area_frascati'].values
    # ejex = f1.to_json()
    # ejey = f2.to_json()
    areas = pd.concat([dataframe[['id_area_unesco']], dataframe[['id_area_frascati']],dataframe['KMeans_Clusters'], dataframe['id_articulo']], axis = 1)
    area = areas.to_json()
    # plt.scatter(f1, f2, c=asignar, s=70)
    # plt.scatter(C[:, 0], C[:, 1], marker='*', c=colores, s=1000)
    # plt.show()
    #valorClustering = dataframe.to_json()
    return make_response(jsonify(area))

def clusterAreasPorAnio(anio_publicacion, num_cluster):
    respuesta = (listaArticulosMineriaPorAnio(anio_publicacion)).json
    dataframe = pd.io.json.json_normalize(respuesta)
    
    X = np.array(dataframe[["id_area_unesco","id_area_frascati","orden_autor"]])
    y = np.array(dataframe['anio_publicacion'])
    print(X.shape)

    kmeans = KMeans(n_clusters=num_cluster).fit(X)
    centroids = kmeans.cluster_centers_

    # Predicting the clusters
    labels = kmeans.predict(X)

    # Getting the cluster centers
    """C = kmeans.cluster_centers_
    colores=['red','green','blue','cyan','yellow','pink','purple']
    asignar=[]
    for row in labels:
        asignar.append(colores[row])"""

    # fig = plt.figure()
    # ax = Axes3D(fig)
    # ax.scatter(X[:, 0], X[:, 1], X[:, 2], c=asignar,s=60)
    # ax.scatter(C[:, 0], C[:, 1], C[:, 2], marker='*', c=colores, s=1000)
    dataframe['KMeans_Clusters'] = labels
    # Getting the values and plotting it
    f1 = dataframe['id_area_unesco'].values
    f2 = dataframe['id_area_frascati'].values
    # ejex = f1.to_json()
    # ejey = f2.to_json()
    areas = pd.concat([dataframe[['id_area_unesco']], dataframe[['id_area_frascati']],dataframe['KMeans_Clusters'], dataframe['id_articulo']], axis = 1)
    area = areas.to_json()
    # plt.scatter(f1, f2, c=asignar, s=70)
    # plt.scatter(C[:, 0], C[:, 1], marker='*', c=colores, s=1000)
    # plt.show()
    #valorClustering = dataframe.to_json()
    return make_response(jsonify(area))

def clusterMediosPublicacionOrdenAutor(num_cluster):
    respuesta = (listaArticulosMineria()).json
    dataframe = pd.io.json.json_normalize(respuesta)
    
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
    dataframe = pd.io.json.json_normalize(respuesta)
    
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
    dataframe = pd.io.json.json_normalize(respuesta)
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


