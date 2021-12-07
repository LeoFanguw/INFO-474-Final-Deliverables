# INFO-474-Final-Deliverables
 
Group members: Leo Fang, Suzy Nie, Jerray Wu
 
Project Goal: This project aims to create visualizations for the ETA-9089 dataset, which was provided by the U.S. Department of Labor. The target audience includes prospective/current foreign applicants, U.S. policymakers, immigration lawyers, and company human resource departments, etc, who seek key insights assisting themselves or their stakeholders to improve the application or immigration process.
 
[Our Dataset](./dataset.CSV): Permanent residency cards, also known as green cards, are proof of documents that allow foreign citizens to live and travel freely in the U.S. One of the pathways to apply for a permanent residency card is through legal employment. The most important process of employment-based immigration is to obtain a permanent labor certification through filing an ETA 9089 form. This form must prove that the employer has made a faithful effort to hire a U.S. citizen for the position.
 
[Our Processed Dataset](./ETA_9089.csv): The dataset, downloaded from the U.S. Department of Labor website, tracks one of the pathways to apply for a green card through H1B, also known as the work visa. It contains administrative data for the Permanent Employment Certification ETA-9089 Application for all applicants in 2020. It has 154 columns and 94019 rows. For the interest of the analysis, 22 columns are selected, demonstrated in the table below:
 
| ATTRIBUTES | ITEMS |
|  :----:  | :----:  |
| CASE_NUMBER  | *94109 ID in the format of A-00000-00000 |
| CASE_STATUS  | ‘Denied’, ‘Certified’, ‘Certified-Expired’, ‘Withdrawn’ |
| EMPLOYER_NAME  | 23997 Employer Names, ex.GOOGLE LLC.  |
| EMPLOYER_CITY  | *4992 City Names, ex. CHICAGO |
| EMPLOYER_STATE_PROVINCE  | *685 State_Provinces ex. CALIFORNIA |
| EMPLOYER_COUNTRY  | ‘UNITED STATES OF AMERICA’, ‘GERMANY’ |
| EMPLOYER_POSTAL_CODE  | *6717 zip codes ex. 36869 |
| PW_SOC_CODE  | *653 job codes, referring to a job position |
| PW_WAGE  | *10113 wages, ex. $14.49 |
| PW_UNIT_OF_PAY  | ‘Hour’, ‘Bi-Weekly’, ‘Year’, ‘Month’, ‘Week’ |
| WORKSITE_CITY  | *5024 City Names, ex. CHICAGO |
| WORKSITE_STATE  | *55 States ex. CALIFORNIA |
| WORKSITE_POSTAL_CODE  | *7437 zip codes ex. 36869 |
| MINIMUM_EDUCATION  | ‘High School’, ‘None’, ‘Master’s, ‘Bachelor’s, ‘Other’, ‘Doctorate’, ‘Associate’s |
| MAJOR_FIELD_OF_STUDY  | *21989 majors ex. ‘Computer Science’ |
| FIRST_NEWSPAPER_NAME  | *2847 newspaper names ex. ‘ChicagoTribune’ |
| SECOND_NEWSPAPER_AD_NAME  | *2924 newspaper names ex. ‘ChicagoTribune |
| COUNTRY_OF_CITIZENSHIP  | *179 countries of citizenship ex. ‘India |
| FOREIGN_WORKER_BIRTH_COUNTRY  | *187 foreign worker birth country |
| CLASS_OF_ADMISSION  | *45 visa types ex. F-1 [student visa] |
| FOREIGN_WORKER_EDUCATION  | High School’, ‘None’, ‘Master’s, ‘Bachelor’s, ‘Other’, ‘Doctorate’, ‘Associate’s |
| FOREIGN_WORK_INFO_MAJOR  | *9397 majors ex. ‘Computer Science’ |

Our Brainstorm Process: <br>
https://miro.com/app/board/o9J_liUJhP8=/

![Initial Brainstorm][./Brainstorm/1.jpg]
![Histogram][./Brainstorm/2.jpg]
![Pie Chart][./Brainstorm/3.jpg]
![Map][./Brainstorm/4.jpg]