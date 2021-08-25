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
from controladores.ArticuloController import listaArticulos, listaArticulosMineria,listaArticulosMineriaPorAreaUnescoYAnioPublicacion
from controladores.ArticuloController import  listaArticulosMineriaPorAnio, listaArticulosMineriaPorAreaFrascati
from controladores.ArticuloController import  listaArticulosMineriaPorAreaUnesco, listaArticulosMineriaPorAreaFrascatiYAnioPublicacion
from controladores.AutorController import listaAutoresNumPub
from controladores.DetalleReferenciaController import listaDetalleReferencia, listaDetalleReferenciaPorAnio 
from controladores.DetalleReferenciaController import listaDetalleReferenciaPorAreaFrascati, listaDetalleReferenciaPorAreaUnesco
from controladores.DetalleReferenciaController import listaDetalleReferenciaPorAreaFrascatiYAnioPublicacion, listaDetalleReferenciaPorAreaUnescoYAnioPublicacion
from sklearn.decomposition import PCA
from mpl_toolkits.mplot3d import Axes3D

# Nueva Libreia
import json

def clusterFactorImpactoXCuartil(num_cluster):
    respuesta = (listaArticulosMineria()).json
    numeroRegistros = len(respuesta)
    if numeroRegistros < num_cluster:
        return make_response(jsonify("Error"))

    try:
        dataframe = pd.json_normalize(respuesta)
        
        dataframe.cuartil = pd.Categorical(dataframe.cuartil)
        dataframe['quartil'] = dataframe.cuartil.cat.codes
        
        dataframe.factor_impacto = pd.Categorical(dataframe.factor_impacto)
        dataframe['fi'] = dataframe.factor_impacto.cat.codes

        df1 = dataframe[["quartil","fi","anio_publicacion","titulo","cuartil","id_articulo"]]
        datos = df1[["titulo","cuartil","id_articulo"]]
        df1= df1.drop(['titulo','cuartil','id_articulo'], 1)
        datos_norm = (df1-df1.min())/(df1.max()-df1.min())
        datos_norm

        clustering = KMeans(n_clusters = num_cluster , max_iter=300) # se crea el modelo
        clustering.fit(datos_norm) 

        df1['KMeans_Clusters'] = clustering.labels_ 


        pca = PCA(n_components = 2)
        pca_datos = pca.fit_transform(datos_norm)
        pca_datos_df = pd.DataFrame(data = pca_datos, columns = ['Componente_1','Componente_2'])
        pca_nombres_datos = pd.concat([pca_datos_df,df1[['KMeans_Clusters']]], axis = 1)
        pca_nombres_datos

        datos_a_verificar = pd.concat([pca_datos_df,datos,df1], axis = 1)
        datos_a_enviar = datos_a_verificar.to_json()

        return make_response(jsonify(datos_a_enviar))
    except:
        return make_response(jsonify("Error"))


def clusterCuarFIPorAnio(anio_publicacion, num_cluster):

    respuesta = (listaArticulosMineriaPorAnio(anio_publicacion)).json
    numeroRegistros = len(respuesta)
    if numeroRegistros < num_cluster:
        return make_response(jsonify("Error"))
    try:
        dataframe = pd.json_normalize(respuesta)
        
        dataframe.cuartil = pd.Categorical(dataframe.cuartil)
        dataframe['quartil'] = dataframe.cuartil.cat.codes
        
        dataframe.factor_impacto = pd.Categorical(dataframe.factor_impacto)
        dataframe['fi'] = dataframe.factor_impacto.cat.codes

        df1 = dataframe[["quartil","fi","titulo","cuartil","id_articulo"]]
        datos = df1[["titulo","cuartil","id_articulo"]]
        df1= df1.drop(['titulo','cuartil','id_articulo'], 1)
        datos_norm = (df1-df1.min())/(df1.max()-df1.min())
        datos_norm

        clustering = KMeans(n_clusters = num_cluster , max_iter=300) # se crea el modelo
        clustering.fit(datos_norm) 

        df1['KMeans_Clusters'] = clustering.labels_ 


        pca = PCA(n_components = 2)
        pca_datos = pca.fit_transform(datos_norm)
        pca_datos_df = pd.DataFrame(data = pca_datos, columns = ['Componente_1','Componente_2'])
        pca_nombres_datos = pd.concat([pca_datos_df,df1[['KMeans_Clusters']]], axis = 1)
        pca_nombres_datos

        datos_a_verificar = pd.concat([pca_datos_df,datos,df1], axis = 1)
        datos_a_enviar = datos_a_verificar.to_json()

        return make_response(jsonify(datos_a_enviar))
    except:
        return make_response(jsonify("Error"))



def clusterCuarFIPorAreaFrascati(id_area_frascati, num_cluster):
    respuesta = (listaArticulosMineriaPorAreaFrascati(id_area_frascati)).json
    numeroRegistros = len(respuesta)
    if numeroRegistros < num_cluster:
        return make_response(jsonify("Error"))
    try:
        dataframe = pd.json_normalize(respuesta)
        
        dataframe.cuartil = pd.Categorical(dataframe.cuartil)
        dataframe['quartil'] = dataframe.cuartil.cat.codes
        
        dataframe.factor_impacto = pd.Categorical(dataframe.factor_impacto)
        dataframe['fi'] = dataframe.factor_impacto.cat.codes

        df1 = dataframe[["quartil","fi","anio_publicacion","titulo","cuartil","id_articulo"]]
        datos = df1[["titulo","cuartil","id_articulo"]]
        df1= df1.drop(['titulo','cuartil','id_articulo'], 1)
        datos_norm = (df1-df1.min())/(df1.max()-df1.min())
        datos_norm

        clustering = KMeans(n_clusters = num_cluster , max_iter=300) # se crea el modelo
        clustering.fit(datos_norm) 

        df1['KMeans_Clusters'] = clustering.labels_ 


        pca = PCA(n_components = 2)
        pca_datos = pca.fit_transform(datos_norm)
        pca_datos_df = pd.DataFrame(data = pca_datos, columns = ['Componente_1','Componente_2'])
        pca_nombres_datos = pd.concat([pca_datos_df,df1[['KMeans_Clusters']]], axis = 1)
        pca_nombres_datos

        datos_a_verificar = pd.concat([pca_datos_df,datos,df1], axis = 1)
        datos_a_enviar = datos_a_verificar.to_json()

        return make_response(jsonify(datos_a_enviar))
    except:
        return make_response(jsonify("Error"))

def clusterCuarFIPorAreaUnesco(id_area_unesco, num_cluster):
    respuesta = (listaArticulosMineriaPorAreaUnesco(id_area_unesco)).json
    numeroRegistros = len(respuesta)
    if numeroRegistros < num_cluster:
        return make_response(jsonify("Error"))
    try:
        dataframe = pd.json_normalize(respuesta)
        
        dataframe.cuartil = pd.Categorical(dataframe.cuartil)
        dataframe['quartil'] = dataframe.cuartil.cat.codes
        
        dataframe.factor_impacto = pd.Categorical(dataframe.factor_impacto)
        dataframe['fi'] = dataframe.factor_impacto.cat.codes

        df1 = dataframe[["quartil","fi","anio_publicacion","titulo","cuartil","id_articulo"]]
        datos = df1[["titulo","cuartil","id_articulo"]]
        df1= df1.drop(['titulo','cuartil','id_articulo'], 1)
        datos_norm = (df1-df1.min())/(df1.max()-df1.min())
        datos_norm

        clustering = KMeans(n_clusters = num_cluster , max_iter=300) # se crea el modelo
        clustering.fit(datos_norm) 

        df1['KMeans_Clusters'] = clustering.labels_ 


        pca = PCA(n_components = 2)
        pca_datos = pca.fit_transform(datos_norm)
        pca_datos_df = pd.DataFrame(data = pca_datos, columns = ['Componente_1','Componente_2'])
        pca_nombres_datos = pd.concat([pca_datos_df,df1[['KMeans_Clusters']]], axis = 1)
        pca_nombres_datos

        datos_a_verificar = pd.concat([pca_datos_df,datos,df1], axis = 1)
        datos_a_enviar = datos_a_verificar.to_json()

        return make_response(jsonify(datos_a_enviar))
    except:
        return make_response(jsonify("Error"))

def clusterCuarFIPorAreaFrascatiYAnioPublicacion(anio_publicacion, id_area_frascati, num_cluster):
    respuesta = (listaArticulosMineriaPorAreaFrascatiYAnioPublicacion(anio_publicacion, id_area_frascati)).json
    numeroRegistros = len(respuesta)
    if numeroRegistros < num_cluster:
        return make_response(jsonify("Error"))
    try:
        dataframe = pd.json_normalize(respuesta)
        
        dataframe.cuartil = pd.Categorical(dataframe.cuartil)
        dataframe['quartil'] = dataframe.cuartil.cat.codes
        
        dataframe.factor_impacto = pd.Categorical(dataframe.factor_impacto)
        dataframe['fi'] = dataframe.factor_impacto.cat.codes

        df1 = dataframe[["quartil","fi","titulo","cuartil","id_articulo"]]
        datos = df1[["titulo","cuartil","id_articulo"]]
        df1= df1.drop(['titulo','cuartil','id_articulo'], 1)
        datos_norm = (df1-df1.min())/(df1.max()-df1.min())
        datos_norm

        clustering = KMeans(n_clusters = num_cluster , max_iter=300) # se crea el modelo
        clustering.fit(datos_norm) 

        df1['KMeans_Clusters'] = clustering.labels_ 


        pca = PCA(n_components = 2)
        pca_datos = pca.fit_transform(datos_norm)
        pca_datos_df = pd.DataFrame(data = pca_datos, columns = ['Componente_1','Componente_2'])
        pca_nombres_datos = pd.concat([pca_datos_df,df1[['KMeans_Clusters']]], axis = 1)
        pca_nombres_datos

        datos_a_verificar = pd.concat([pca_datos_df,datos,df1], axis = 1)
        datos_a_enviar = datos_a_verificar.to_json()

        return make_response(jsonify(datos_a_enviar))
    except:
        return make_response(jsonify("Error"))

def clusterCuarFIPorAnioAreaUnescoYAnioPublicacion(anio_publicacion, id_area_unesco, num_cluster):
    respuesta = (listaArticulosMineriaPorAreaUnescoYAnioPublicacion(anio_publicacion,id_area_unesco)).json
    numeroRegistros = len(respuesta)
    if numeroRegistros < num_cluster:
        return make_response(jsonify("Error"))
    try:
        dataframe = pd.json_normalize(respuesta)
        
        dataframe.cuartil = pd.Categorical(dataframe.cuartil)
        dataframe['quartil'] = dataframe.cuartil.cat.codes
        
        dataframe.factor_impacto = pd.Categorical(dataframe.factor_impacto)
        dataframe['fi'] = dataframe.factor_impacto.cat.codes

        df1 = dataframe[["quartil","fi","titulo","cuartil","id_articulo"]]
        datos = df1[["titulo","cuartil","id_articulo"]]
        df1= df1.drop(['titulo','cuartil','id_articulo'], 1)
        datos_norm = (df1-df1.min())/(df1.max()-df1.min())
        datos_norm

        clustering = KMeans(n_clusters = num_cluster , max_iter=300) # se crea el modelo
        clustering.fit(datos_norm) 

        df1['KMeans_Clusters'] = clustering.labels_ 


        pca = PCA(n_components = 2)
        pca_datos = pca.fit_transform(datos_norm)
        pca_datos_df = pd.DataFrame(data = pca_datos, columns = ['Componente_1','Componente_2'])
        pca_nombres_datos = pd.concat([pca_datos_df,df1[['KMeans_Clusters']]], axis = 1)
        pca_nombres_datos

        datos_a_verificar = pd.concat([pca_datos_df,datos,df1], axis = 1)
        datos_a_enviar = datos_a_verificar.to_json()

        return make_response(jsonify(datos_a_enviar))
    except:
        return make_response(jsonify("Error"))


def redesAutoresAreasOrden(orden, area):
    respuesta = (listaArticulosMineria()).json
    numeroRegistros = len(respuesta)

    df = pd.json_normalize(respuesta)

    areas= df['id_area_unesco']==area
    area = df[areas]
    nombre_area = str(area['nombre_area_unesco_especifico'].iloc[:1])
    index = nombre_area.index('\nName')
    index2 = nombre_area.index('    ')
    nom_area = nombre_area[index2:index]
  
    
    freq = area.groupby(['nombres']).size()

    orden = area['orden_autor']==orden
    ordenAutor = area[orden]
    freqO = ordenAutor.groupby(['nombres','orden_autor']).size() 

    # Inicio Grafico

    fig, ax = plt.subplots(figsize=(20,17))
    #ax.legend(freq)
    df2 = pd.DataFrame({'froma':ordenAutor.nombres, 'to': ordenAutor.id_area_unesco})
    dfFinal = df2.sort_values('froma')
    dfFinal1 = dfFinal.drop_duplicates()

    G = nx.from_pandas_edgelist(dfFinal1, 'froma', 'to', create_using=nx.Graph())
   
    num_pub_autor1 = 0
    num_pub_autor2 = 0
    num_pub_autor3 = 0
    num_pub_autor4 = 0
    num_pub_autor5 = 0
    num_pub_autor6 = 0
    lista = []
    node_sizes = []
    for entry in freqO:
        lista.append(entry)
        if (entry == 5):
            node_sizes.append(9000)
            num_pub_autor5 = 1
        elif (entry == 4):
            node_sizes.append(7000)
            num_pub_autor4 = 1
        elif (entry == 3):
            node_sizes.append(5000)
            num_pub_autor3 = 1
        elif (entry==2):
            node_sizes.append(3000)
            num_pub_autor2 = 1
        else:
            node_sizes.append(1000)
            num_pub_autor1 = 1

    #node_sizes = [4500 if entry == 2 else 1000 for entry in freq]
    bandera = 1
    bandera2 = 1
    bandera3 = 1
    bandera4= 1
    bandera5 = 1
    bandera6 = 1
    lista_colores = []
    for entry in node_sizes:
        if (entry == 11000 and bandera6==1):
            color6 = "#FFDAB9"
            bandera6 = 2
            lista_colores.append(6)
            ax.plot([0][0], color=color6,label="6 Pub")
        if (entry == 9000 and bandera5==1):
            color5 = "#FA8072"
            bandera5 = 2
            lista_colores.append(5)
            ax.plot([0][0], color=color5,label="5 Pub", linestyle="--")
        if (entry == 7000 and bandera4==1):
            color4 = "#2E8B57"
            bandera4=2
            lista_colores.append(4)
            ax.plot([0][0], color=color4,label="4 Pub", linestyle="--")
        if (entry == 5000 and bandera3==1):
            color3 = "#4682B4"
            bandera3=2
            lista_colores.append(3)
            ax.plot([0][0], color=color3,label="3 Pub", linestyle="--")
        if (entry==3000 and bandera2==1):
            color2 = "#DDA0DD"
            bandera2=2
            lista_colores.append(2)
            ax.plot([0][0], color=color2,label="2 Pub", linestyle="--")
        if(entry==1000 and bandera==1):
            color1 = "#40E0D0"
            bandera=2
            lista_colores.append(1)
            ax.plot([0][0], color=color1,label="1 Pub", linestyle="--")

    lista_colores.sort()
    listaReemplazar = []

    for i in lista_colores:
        if i == 1:
            listaReemplazar.append(color1)
        if i == 2:
            listaReemplazar.append(color2)
        if i == 3:
            listaReemplazar.append(color3)
        if i == 4:
            listaReemplazar.append(color4)
        if i == 5:
            listaReemplazar.append(color5)
        if i == 6:
            listaReemplazar.append(color6)

    for i in range(len(node_sizes)):
        if ((i !=1000) and (i+1 != 1000)):
            #print("entre ", i ,"veces")
            node_sizes.insert(i+1,1000)
            break
        if ((i !=1000) and (i-1 != 1000)):
            node_sizes.insert(i-1,1000)
            break

    # Set node colors
    cmap = matplotlib.colors.ListedColormap(listaReemplazar)

    nx.draw(G, with_labels=True, edgecolors='brown', node_color=node_sizes, cmap=cmap, node_size = node_sizes, font_size = 10, ax=ax)

    #plt.legend(["3Pub","2Pub","1Pub"])
    plt.axis('off')
    fig.set_facecolor('w')

    plt.legend(fontsize=16)

    fig.tight_layout()
    #plt.title(nom_area, fontsize=15)

    # Fin grafico
    # Crear y Almacenar Imagen
    imagenArea = io.BytesIO()
    plt.savefig(imagenArea,  format='png')
    imagenArea.seek(0)
    pic_hash = base64.b64encode(imagenArea.read()).decode()
    
    return make_response(jsonify({"valorimagenarea": pic_hash}))

def datosHighChart():
    respuesta = (listaAutoresNumPub()).json

    try:
        dataframe = pd.json_normalize(respuesta)
        dataframe = dataframe.groupby(['nombre','orden_autor']).size().to_frame('num_pub').reset_index()
        lista = dataframe.to_numpy().tolist()
        columns_names = dataframe.columns.values
        datos_a_enviar = dataframe.to_json()
        #print(datos_a_enviar)
        return make_response(jsonify(datos_a_enviar))
    except:
        return make_response(jsonify("Error"))

def datosHighChartTotalAutores():
    respuesta = (listaAutoresNumPub()).json

    try:
        dataframe = pd.json_normalize(respuesta)
        dataframe = dataframe.groupby(['nombre']).size().to_frame('total_pub').reset_index()
        lista = dataframe.to_numpy().tolist()
        columns_names = dataframe.columns.values
        datos_a_enviar = dataframe.to_json()
        #print(datos_a_enviar)
        return make_response(jsonify(datos_a_enviar))
    except:
        return make_response(jsonify("Error"))









