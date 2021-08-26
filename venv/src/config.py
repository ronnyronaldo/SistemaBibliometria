import os
SECRET_KEY = os.urandom(32)
# Grabs the folder where the script runs.
basedir = os.path.abspath(os.path.dirname(__file__))
# Enable debug mode.
DEBUG = True
# Connect to the database
SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://admintl@servidormysqltl:tania123.@servidormysqltl.mysql.database.azure.com:3306/bd_bibliometria'

# Turn off the Flask-SQLAlchemy event system and warning
SQLALCHEMY_TRACK_MODIFICATIONS = False
MYSQL_DATABASE_USER = 'admintl@servidormysqltl'
MYSQL_DATABASE_PASSWORD = 'tania123.'
MYSQL_DATABASE_DB= 'bd_bibliometria'
MYSQL_DATABASE_HOST = 'servidormysqltl.mysql.database.azure.com'
#SQLALCHEMY_POOL_SIZE = 10
#SQLALCHEMY_POOL_TIMEOUT = 300
SQLALCHEMY_MAX_OVERFLOW = -1
"""
# Connect to the database
SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://root@localhost/bd_bibliometria'
# Turn off the Flask-SQLAlchemy event system and warning
SQLALCHEMY_TRACK_MODIFICATIONS = False
MYSQL_DATABASE_USER = 'root'
MYSQL_DATABASE_PASSWORD = ''
MYSQL_DATABASE_DB= 'bd_bibliometria'
MYSQL_DATABASE_HOST = 'localhost'
#SQLALCHEMY_POOL_SIZE = 10
#SQLALCHEMY_POOL_TIMEOUT = 300
SQLALCHEMY_MAX_OVERFLOW = -1"""