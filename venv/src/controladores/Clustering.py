import numpy as np
import pandas as pd
import io
from sklearn import preprocessing 
from sklearn.cluster import KMeans
from sklearn.metrics import pairwise_distances_argmin_min
import seaborn as sb
import matplotlib.pyplot as plt
from matplotlib.pyplot import figure
import networkx as nx
import matplotlib
import base64
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
    
def redesAutores(orden):
    respuesta = (listaArticulosMineria()).json
    numeroRegistros = len(respuesta)

    dataframe = pd.json_normalize(respuesta)
    
    df1 = dataframe[['nombres','orden_autor']]
    
    ord_autor= dataframe['orden_autor']==orden

    uno = dataframe[ord_autor]

    if(orden==1):
        fig, ax = plt.subplots(figsize=(20,15))
        df2 = pd.DataFrame({'froma':uno.nombres.iloc[10:100], 'to': uno.orden_autor.iloc[10:100]})
        node_sizes = [4000 if entry != 2 else 1000 for entry in df2.to]
        G = nx.from_pandas_edgelist(df2, 'froma', 'to', create_using=nx.Graph())
        #plt.subplot(2, 2, 1)
        nx.draw(G, with_labels=True, edgecolors='red', node_color='#DFE5E5', node_size = 1000, font_size = 8)
        #grafico = nx.draw(G, with_labels=True, edgecolors='red', node_color='#00b4d9', node_size = 1000, font_size = 8)
        plt.title('Autores según su orden en los artículos', fontsize=18)
    elif(orden==2):
        fig, ax = plt.subplots(figsize=(20,15))
        df2 = pd.DataFrame({'froma':uno.nombres.iloc[10:100], 'to': uno.orden_autor.iloc[10:100]})
        node_sizes = [4000 if entry != 2 else 1000 for entry in df2.to]
        G = nx.from_pandas_edgelist(df2, 'froma', 'to', create_using=nx.Graph())
        #plt.subplot(2, 2, 1)
        nx.draw(G, with_labels=True, edgecolors='red', node_color='#DFE5E5', node_size = 1000, font_size = 8)
        #grafico = nx.draw(G, with_labels=True, edgecolors='red', node_color='#00b4d9', node_size = 1000, font_size = 8)
        plt.title('Autores según su orden en los artículos', fontsize=18)
    elif(orden==3):
        fig, ax = plt.subplots(figsize=(20,15))
        df2 = pd.DataFrame({'froma':uno.nombres.iloc[10:100], 'to': uno.orden_autor.iloc[10:100]})
        node_sizes = [4000 if entry != 2 else 1000 for entry in df2.to]
        G = nx.from_pandas_edgelist(df2, 'froma', 'to', create_using=nx.Graph())
        #plt.subplot(2, 2, 1)
        nx.draw(G, with_labels=True, edgecolors='red', node_color='#DFE5E5', node_size = 1000, font_size = 8)
        #grafico = nx.draw(G, with_labels=True, edgecolors='red', node_color='#00b4d9', node_size = 1000, font_size = 8)
        plt.title('Autores según su orden en los artículos', fontsize=18)
    elif(orden==4):
        fig, ax = plt.subplots(figsize=(20,15))
        df2 = pd.DataFrame({'froma':uno.nombres.iloc[10:100], 'to': uno.orden_autor.iloc[10:100]})
        node_sizes = [4000 if entry != 2 else 1000 for entry in df2.to]
        G = nx.from_pandas_edgelist(df2, 'froma', 'to', create_using=nx.Graph())
        #plt.subplot(2, 2, 1)
        nx.draw(G, with_labels=True, edgecolors='red', node_color='#DFE5E5', node_size = 1000, font_size = 8)
        #grafico = nx.draw(G, with_labels=True, edgecolors='red', node_color='#00b4d9', node_size = 1000, font_size = 8)
        plt.title('Autores según su orden en los artículos', fontsize=18)
    elif(orden==4):
        fig, ax = plt.subplots(figsize=(20,15))
        df2 = pd.DataFrame({'froma':uno.nombres.iloc[10:100], 'to': uno.orden_autor.iloc[10:100]})
        node_sizes = [4000 if entry != 2 else 1000 for entry in df2.to]
        G = nx.from_pandas_edgelist(df2, 'froma', 'to', create_using=nx.Graph())
        #plt.subplot(2, 2, 1)
        nx.draw(G, with_labels=True, edgecolors='red', node_color='#DFE5E5', node_size = 1000, font_size = 8)
        #grafico = nx.draw(G, with_labels=True, edgecolors='red', node_color='#00b4d9', node_size = 1000, font_size = 8)
        plt.title('Autores según su orden en los artículos', fontsize=18)
    elif(orden==5):
        fig, ax = plt.subplots(figsize=(20,15))
        df2 = pd.DataFrame({'froma':uno.nombres.iloc[10:100], 'to': uno.orden_autor.iloc[10:100]})
        node_sizes = [4000 if entry != 2 else 1000 for entry in df2.to]
        G = nx.from_pandas_edgelist(df2, 'froma', 'to', create_using=nx.Graph())
        #plt.subplot(2, 2, 1)
        nx.draw(G, with_labels=True, edgecolors='red', node_color='#DFE5E5', node_size = 1000, font_size = 8)
        #grafico = nx.draw(G, with_labels=True, edgecolors='red', node_color='#00b4d9', node_size = 1000, font_size = 8)
        plt.title('Autores según su orden en los artículos', fontsize=18)
    elif(orden==6):
        fig, ax = plt.subplots(figsize=(20,15))
        df2 = pd.DataFrame({'froma':uno.nombres.iloc[10:100], 'to': uno.orden_autor.iloc[10:100]})
        node_sizes = [4000 if entry != 2 else 1000 for entry in df2.to]
        G = nx.from_pandas_edgelist(df2, 'froma', 'to', create_using=nx.Graph())
        #plt.subplot(2, 2, 1)
        nx.draw(G, with_labels=True, edgecolors='red', node_color='#DFE5E5', node_size = 1000, font_size = 8)
        #grafico = nx.draw(G, with_labels=True, edgecolors='red', node_color='#00b4d9', node_size = 1000, font_size = 8)
        plt.title('Autores según su orden en los artículos', fontsize=18)
    elif(orden==7):
        fig, ax = plt.subplots(figsize=(20,15))
        df2 = pd.DataFrame({'froma':uno.nombres.iloc[:911], 'to': uno.orden_autor.iloc[:911]})
        node_sizes = [4000 if entry != 2 else 1000 for entry in df2.to]
        G = nx.from_pandas_edgelist(df2, 'froma', 'to', create_using=nx.Graph())
        #plt.subplot(2, 2, 1)
        nx.draw(G, with_labels=True, edgecolors='red', node_color='#DFE5E5', node_size = 1000, font_size = 8)
        #grafico = nx.draw(G, with_labels=True, edgecolors='red', node_color='#00b4d9', node_size = 1000, font_size = 8)
        plt.title('Autores según su orden en los artículos', fontsize=18)
    elif(orden==8):
        fig, ax = plt.subplots(figsize=(20,15))
        df2 = pd.DataFrame({'froma':uno.nombres.iloc[:911], 'to': uno.orden_autor.iloc[:911]})
        node_sizes = [4000 if entry != 2 else 1000 for entry in df2.to]
        G = nx.from_pandas_edgelist(df2, 'froma', 'to', create_using=nx.Graph())
        #plt.subplot(2, 2, 1)
        nx.draw(G, with_labels=True, edgecolors='red', node_color='#DFE5E5', node_size = 1000, font_size = 8)
        #grafico = nx.draw(G, with_labels=True, edgecolors='red', node_color='#00b4d9', node_size = 1000, font_size = 8)
        plt.title('Autores según su orden en los artículos', fontsize=18)
    elif(orden==9):
        fig, ax = plt.subplots(figsize=(20,15))
        df2 = pd.DataFrame({'froma':uno.nombres.iloc[:911], 'to': uno.orden_autor.iloc[:911]})
        node_sizes = [4000 if entry != 2 else 1000 for entry in df2.to]
        G = nx.from_pandas_edgelist(df2, 'froma', 'to', create_using=nx.Graph())
        #plt.subplot(2, 2, 1)
        nx.draw(G, with_labels=True, edgecolors='red', node_color='#DFE5E5', node_size = 1000, font_size = 8)
        #grafico = nx.draw(G, with_labels=True, edgecolors='red', node_color='#00b4d9', node_size = 1000, font_size = 8)
        plt.title('Autores según su orden en los artículos', fontsize=18)
    elif(orden==10):
        fig, ax = plt.subplots(figsize=(20,15))
        df2 = pd.DataFrame({'froma':uno.nombres.iloc[:911], 'to': uno.orden_autor.iloc[:911]})
        node_sizes = [4000 if entry != 2 else 1000 for entry in df2.to]
        G = nx.from_pandas_edgelist(df2, 'froma', 'to', create_using=nx.Graph())
        #plt.subplot(2, 2, 1)
        nx.draw(G, with_labels=True, edgecolors='red', node_color='#DFE5E5', node_size = 1000, font_size = 8)
        #grafico = nx.draw(G, with_labels=True, edgecolors='red', node_color='#00b4d9', node_size = 1000, font_size = 8)
        plt.title('Autores según su orden en los artículos', fontsize=18)
    elif(orden==11):
        fig, ax = plt.subplots(figsize=(20,15))
        df2 = pd.DataFrame({'froma':uno.nombres.iloc[:911], 'to': uno.orden_autor.iloc[:911]})
        node_sizes = [4000 if entry != 2 else 1000 for entry in df2.to]
        G = nx.from_pandas_edgelist(df2, 'froma', 'to', create_using=nx.Graph())
        #plt.subplot(2, 2, 1)
        nx.draw(G, with_labels=True, edgecolors='red', node_color='#DFE5E5', node_size = 1000, font_size = 8)
        #grafico = nx.draw(G, with_labels=True, edgecolors='red', node_color='#00b4d9', node_size = 1000, font_size = 8)
        plt.title('Autores según su orden en los artículos', fontsize=18)
    elif(orden==12):
        fig, ax = plt.subplots(figsize=(20,15))
        df2 = pd.DataFrame({'froma':uno.nombres.iloc[:911], 'to': uno.orden_autor.iloc[:911]})
        node_sizes = [4000 if entry != 2 else 1000 for entry in df2.to]
        G = nx.from_pandas_edgelist(df2, 'froma', 'to', create_using=nx.Graph())
        #plt.subplot(2, 2, 1)
        nx.draw(G, with_labels=True, edgecolors='red', node_color='#DFE5E5', node_size = 1000, font_size = 8)
        #grafico = nx.draw(G, with_labels=True, edgecolors='red', node_color='#00b4d9', node_size = 1000, font_size = 8)
        plt.title('Autores según su orden en los artículos', fontsize=18)
    elif(orden==13):
        fig, ax = plt.subplots(figsize=(20,15))
        df2 = pd.DataFrame({'froma':uno.nombres.iloc[:911], 'to': uno.orden_autor.iloc[:911]})
        node_sizes = [4000 if entry != 2 else 1000 for entry in df2.to]
        G = nx.from_pandas_edgelist(df2, 'froma', 'to', create_using=nx.Graph())
        #plt.subplot(2, 2, 1)
        nx.draw(G, with_labels=True, edgecolors='red', node_color='#DFE5E5', node_size = 1000, font_size = 8)
        #grafico = nx.draw(G, with_labels=True, edgecolors='red', node_color='#00b4d9', node_size = 1000, font_size = 8)
        plt.title('Autores según su orden en los artículos', fontsize=18)

        fig, ax = plt.subplots(figsize=(20,15))
        df2 = pd.DataFrame({'froma':uno.nombres.iloc[10:100], 'to': uno.orden_autor.iloc[10:100]})
        node_sizes = [4000 if entry != 2 else 1000 for entry in df2.to]
        G = nx.from_pandas_edgelist(df2, 'froma', 'to', create_using=nx.Graph())
        #plt.subplot(2, 2, 1)
        nx.draw(G, with_labels=True, edgecolors='red', node_color='#DFE5E5', node_size = 1000, font_size = 8)
        #grafico = nx.draw(G, with_labels=True, edgecolors='red', node_color='#00b4d9', node_size = 1000, font_size = 8)
        plt.title('Autores según su orden en los artículos', fontsize=18)
    elif(orden==19):
        fig, ax = plt.subplots(figsize=(20,15))
        df2 = pd.DataFrame({'froma':uno.nombres.iloc[:911], 'to': uno.orden_autor.iloc[:911]})
        node_sizes = [4000 if entry != 2 else 1000 for entry in df2.to]
        G = nx.from_pandas_edgelist(df2, 'froma', 'to', create_using=nx.Graph())
        #plt.subplot(2, 2, 1)
        nx.draw(G, with_labels=True, edgecolors='red', node_color='#DFE5E5', node_size = 1000, font_size = 8)
        #grafico = nx.draw(G, with_labels=True, edgecolors='red', node_color='#00b4d9', node_size = 1000, font_size = 8)
        plt.title('Autores según su orden en los artículos', fontsize=18)
    else:
        print("No existe ese orden de autor")

    imagen = io.BytesIO()
    plt.savefig(imagen,  format='png')
    imagen.seek(0)
    pic_hash = base64.b64encode(imagen.read()).decode()

    #print(pic_hash)
    #plt.show()

    #mediosOrden = mediosPublicacionOrden.to_json()
    
    return make_response(jsonify({"valorimagen": pic_hash}))

def redesAutoresAreas(area):
    respuesta = (listaArticulosMineria()).json
    numeroRegistros = len(respuesta)

    dataframe = pd.json_normalize(respuesta)
    
    df1 = dataframe[['nombres','orden_autor','id_area_unesco','nombre_area_unesco_amplio']]
    
    areas= dataframe['id_area_unesco']==area
    area = dataframe[areas]
    nombre_area = str(area['nombre_area_unesco_especifico'].iloc[:1])
    index = nombre_area.index('\nName')
    index2 = nombre_area.index('    ')
    nom_area = nombre_area[index2:index]

    fig, ax = plt.subplots(figsize=(20,17))
    df2 = pd.DataFrame({'froma':area.nombres, 'to': area.id_area_unesco})
    G = nx.from_pandas_edgelist(df2, 'froma', 'to', create_using=nx.Graph())
    #plt.subplot(2, 2, 1)
    nx.draw(G, with_labels=True, edgecolors='brown', node_color='#64ED6C', node_size = 1000, font_size = 8)
    plt.title(nom_area, fontsize=18)

    print(nom_area)
    # Crear y Almacenar Imagen
    imagenArea = io.BytesIO()
    plt.savefig(imagenArea,  format='png')
    imagenArea.seek(0)
    pic_hash = base64.b64encode(imagenArea.read()).decode()
    
    return make_response(jsonify({"valorimagenarea": pic_hash}))

def clusterCuartilAreaUnesco(num_cluster):
    respuesta = (listaArticulosMineria()).json
    numeroRegistros = len(respuesta)
    if numeroRegistros < num_cluster:
        return make_response(jsonify("Error"))
    
    dataframe = pd.json_normalize(respuesta)
    
    dataframe.cuartil = pd.Categorical(dataframe.cuartil)
    dataframe['Quartil'] = dataframe.cuartil.cat.codes
    dataframe['Quartil'].head()
    
    X = np.array(dataframe[["id_area_unesco","Quartil"]])
    y = np.array(dataframe['anio_publicacion'])
    print(X.shape)

    kmeans = KMeans(n_clusters=num_cluster).fit(X)
    centroids = kmeans.cluster_centers_

    labels = kmeans.predict(X)

    dataframe['KMeans_Clusters'] = labels
    # Getting the values and plotting it
    f1 = dataframe['id_area_unesco'].values
    f2 = dataframe['Quartil'].values

    areas = pd.concat([dataframe[['id_area_unesco']], dataframe[['Quartil']],dataframe['KMeans_Clusters'], dataframe['id_articulo']], axis = 1)
    area = areas.to_json()

    return make_response(jsonify(area))




