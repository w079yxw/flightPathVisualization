
import numpy as np
import pandas as pd
import time

# from sklearn.model_selection import cross_val_score, GridSearchCV, cross_validate, train_test_split
# from sklearn.metrics import accuracy_score, classification_report
# from sklearn.svm import SVC
# from sklearn.linear_model import LinearRegression
# from sklearn.ensemble import RandomForestClassifier
# from sklearn.preprocessing import StandardScaler, normalize
# from sklearn.decomposition import PCA


IATA_counts = pd.read_csv('2015_flights_IATA_CountV2.csv')
county_social = pd.read_csv('acs2015_county_dataV2.csv')
airport=pd.read_csv('airport.csv')
city_county=pd.read_csv('cityCounty.csv')

del IATA_counts['Unnamed: 0']
del airport['latitude']
del airport['longitude']
del airport['country']
del city_county['city_ascii']
del city_county['county_fips']
del city_county['lat']
del city_county['lng']
del city_county['population']
del city_county['population_proper']
del city_county['density']
del city_county['incorporated']
del city_county['timezone']
del city_county['zips']
del city_county['id']
del city_county['source']



temp=pd.merge(IATA_counts, airport, left_on='ORIGIN_AIRPORT',right_on='iata', how='left')
del temp['iata']
temp=pd.merge(temp,city_county,left_on=['city','state'],right_on=['city','state_id'],how='left')
del temp['state_id']
temp=pd.merge(temp,county_social,left_on=['state_name','county_name'],right_on=['State','County'],how='left')
del temp['state_name']
del temp['county_name']
del temp['State']

lst=[]
postfix='_org'
for col in temp.columns.values[5:].tolist():
    new_col = col+postfix
    lst.append(new_col)

new_header_lst =  temp.columns.values[0:5].tolist()+lst
temp.columns = new_header_lst

org_len=len(temp.columns.values)

temp=pd.merge(temp, airport, left_on='DESTINATION_AIRPORT',right_on='iata', how='left')
del temp['iata']
temp=pd.merge(temp,city_county,left_on=['city','state'],right_on=['city','state_id'],how='left')
del temp['state_id']
temp=pd.merge(temp,county_social,left_on=['state_name','county_name'],right_on=['State','County'],how='left')
del temp['state_name']
del temp['county_name']
del temp['State']

lst=[]
postfix='_des'
for col in temp.columns.values[org_len:].tolist():
    new_col = col+postfix
    lst.append(new_col)

new_header_lst =  temp.columns.values[0:org_len].tolist()+lst
temp.columns = new_header_lst
temp.to_csv('out.csv')


