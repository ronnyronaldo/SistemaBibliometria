import numpy as np
import pandas as pd
import io
from sklearn import preprocessing 
from sklearn.cluster import KMeans
import matplotlib.pyplot as plt
from flask import Flask, request, jsonify, make_response
from controladores.ArticuloController import listaArticulosMineria, listaArticulosMineriaAnios
from sklearn.decomposition import PCA


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
