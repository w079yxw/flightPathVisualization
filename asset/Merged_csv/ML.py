## Data and Visual Analytics - Homework 4
## Georgia Institute of Technology
## Applying ML algorithms to detect eye state

import numpy as np
import pandas as pd
import time

from sklearn.model_selection import cross_val_score, GridSearchCV, cross_validate, train_test_split
from sklearn.metrics import accuracy_score, classification_report, r2_score
from sklearn.svm import SVC
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler, normalize
from sklearn.decomposition import PCA
from sklearn.feature_selection import SelectKBest
from sklearn.feature_selection import mutual_info_classif, f_classif, chi2



data = pd.read_csv('out.csv')

data=data.dropna()

del data['AirportName_des']
del data['city_des']
del data['state_des']
del data['CensusId_des']
del data['County_des']

del data['IncomePerCapErr_des']
del data['IncomePerCapErr_org']
del data['IncomeErr_des']
del data['IncomeErr_org']

y_data = data.loc[:, data.columns == "DELAY_RATIO"]
x_data = data.loc[:,'TotalPop_org':'Unemployment_des']
y_data=y_data.round()

delay_data=data.loc[:,'ORIGIN_AIRPORT':'DESTINATION_AIRPORT']
delay_data=pd.concat([delay_data,y_data],axis=1)
delay_data.columns=['origin','destination','delay_probability']
delay_data.to_csv('delay.csv',index=False)


############## Select feature: ####################
selector= SelectKBest(score_func= chi2, k= 22) ###### mutual_info_classif  f_classif chi2
selector.fit(x_data, y_data)
top_sel= selector.get_support(True)
x_data=x_data.iloc[:,top_sel]

random_state = 100



x_data=x_data[['TotalPop_des','TotalPop_org','Income_des','Income_org','Transit_des','Transit_org']]
print(x_data)


#split train and test
x_train,x_test,y_train,y_test=train_test_split(x_data,y_data,test_size=0.3,random_state=random_state,shuffle = True)

# ############################################### Linear Regression ###################################################

reg = LinearRegression().fit(x_train, y_train)
print ('//////////////////////////     Linear Regression    ///////////////////////////////')
y_t_pred=reg.predict(x_train)
train_acc=r2_score(y_train,y_t_pred)
y_t_pred_r=y_t_pred.round()
print ('train accuracy', accuracy_score(y_train,y_t_pred_r))
#print'r2_train:',train_acc
y_pred=reg.predict(x_test)

y_pred_r=y_pred.round()
print ('test accuracy', accuracy_score(y_test,y_pred_r))
test_acc=r2_score(y_test,y_pred)
#print"r2_test:",test_acc
print ('////////////////////////////////////////////////////////////////////////////////')
print
print ('//////////////////////////     Random Forest    ////////////////////////////////')

clf=RandomForestClassifier()
clf.fit(x_train,y_train)

clf_t_pred=clf.predict(x_train)
clf_t_acc=accuracy_score(y_train,clf_t_pred)
print("Random forest train accuracy:",clf_t_acc)
clf_pred=clf.predict(x_test)
clf_acc=accuracy_score(y_test,clf_pred)
print("Random forest test accuracy:",clf_acc)
imp=clf.feature_importances_
print ('Random forest feature importance:',imp)
idx=np.argsort(-imp)
print ('Random forest feature importance ranking:', idx)
columns = x_data.columns.values.tolist()
lst =[columns[i] for i in idx]

print ('**********************************************************************************************************')
print ('* Important Features:', lst, '*')
print ('**********************************************************************************************************')



# TODO: Tune the hyper-parameters 'n_estimators' and 'max_depth'.


#
RF_para={'n_estimators':(1,2,3,4,5,10),'max_depth':(None,1,2,3,4,5,)}
GS=GridSearchCV(clf,RF_para,cv=10,n_jobs=-1)
GS.fit(x_train,y_train)
print ('Random forest GridSearch best parameters:',GS.best_params_,'best score:',GS.best_score_)
GS_t_pre=GS.predict(x_train)
GS_t_acc=accuracy_score(y_train,GS_t_pre)
print ('Random forest train accuracy after tuning:',GS_t_acc)
GS_pre=GS.predict(x_test)
GS_acc=accuracy_score(y_test,GS_pre)
print ('Random forest test accuracy after tuning:',GS_acc)








print('######################### Support Vector Machine ##########################')

scaler=StandardScaler()
x_train_s=scaler.fit_transform(x_train)
x_test_s=scaler.fit_transform(x_test)
s_clf=SVC()
s_clf.fit(x_train_s,y_train)


s_t_pred=s_clf.predict(x_train_s)
s_t_acc=accuracy_score(y_train,s_t_pred)
print ('SVM train accuracy:', s_t_acc)
s_pred=s_clf.predict(x_test_s)
s_acc=accuracy_score(y_test,s_pred)
print ('SVM test accuracy:', s_acc)


SVM_para={'C':(0.01,0.1,1,10),'kernel':('rbf','linear')}
GSS=GridSearchCV(s_clf,SVM_para,cv=10,n_jobs=-1)
GSS.fit(x_train_s,y_train)
print ('SVM GridSearch best parameters:',GSS.best_params_,'best score:',GSS.best_score_)
GSS_t_pre=GSS.predict(x_train_s)
GSS_t_acc=accuracy_score(y_train,GSS_t_pre)
print ('SVM train accuracy after tuning:',GSS_t_acc)
GSS_pre=GSS.predict(x_test_s)
GSS_acc=accuracy_score(y_test,GSS_pre)
print ('SVM test accuracy after tuning:',GSS_acc)
#print GSS.cv_results_



# ######################################### Principal Component Analysis #################################################

#print '/////////////////////////////////// PCA //////////////////////////'
#pca = PCA(n_components=6, svd_solver='full')
#new_data=pca.fit_transform(x_data)
#print x_data
#print 'Percentage of variance explained by components:',pca.explained_variance_ratio_
#print 'Singular values corresponding to components:',pca.singular_values_