import numpy as np
import pandas as pd
import io
from sklearn import preprocessing 
from sklearn.cluster import KMeans
import matplotlib.pyplot as plt
from flask import Flask, request, jsonify, make_response
from controladores.ArticuloController import listaArticulosMineria
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
    #plt.plot(range(1,21),wcss)
    #plt.title("Codo de Jambu")
    #plt.xlabel("Numero de Clusters")
    #plt.ylabel("wcss")
    #plt.show()

    clustering = KMeans(n_clusters = 6, max_iter=300) # se crea el modelo
    clustering.fit(areas_norm) #Aplica el modelo a mis datos
    df['KMeans_Clusters'] = clustering.labels_ # Los resultados del clustering se guardan en lables_ dentro del modelo
    df.head()

    pca = PCA(n_components = 2)
    pca_areas = pca.fit_transform(areas_norm)
    pca_areas_df = pd.DataFrame(data = pca_areas, columns = ['Componente_1','Componente_2'])
    pca_nombres_areas = pd.concat([pca_areas_df, df[['KMeans_Clusters']]], axis = 1)
    
    grafico = plt.figure(figsize = (6,6))

    ax = grafico.add_subplot(1,1,1)
    ax.set_xlabel('Componente 1', fontsize = 15)
    ax.set_ylabel('Componente 2', fontsize = 15)
    ax.set_title('Clusters de areas', fontsize = 20)

    color_theme = np.array(["blue","green","orange","red","black","gray"])
    ax.scatter(x = pca_nombres_areas.Componente_1, y = pca_nombres_areas.Componente_2, c = color_theme[pca_nombres_areas.KMeans_Clusters], s = 50)

    plt.show()
    valorClustering = df.to_json()
    return make_response(jsonify({"cluster": valorClustering}))
