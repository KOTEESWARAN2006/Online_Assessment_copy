create database Online_Assessment
use Online_Assessment

create table Admin_table(
Admin_Id int primary key identity(1,1),
Admin_name varchar(100) not null unique,
Password varchar(50) not null
)
select*from User_table
create table User_table(
User_Id int primary key identity(1,1),
First_name varchar(100) not null,
Last_name varchar(100) not null,
Email varchar(100) not null unique,
Password varchar(50) not null
)

create table Subject_table(
Subject_Id int primary key identity(0,1),
Subject_name varchar(100) not null unique
)

create table Difficulty_table(
Difficulty_Id int primary key identity(0,1),
Difficulty_level varchar(50) not null unique
)

create table Question_table(
Question_Id int primary key identity(1,1),
Subject_id int foreign key references subject_table(subject_id) not null,
Questions varchar(255) not null,
Difficulty_Id int foreign key references Difficulty_table(Difficulty_Id) not null
)

create table Option_table(
Option_Id int primary key identity(1,1),
Question_Id int foreign key references Question_table(Question_Id) not null,
Options varchar(255) not null,
Answer bit not null
)

create table Test_table(
Test_Id int primary key identity(1,1),
Test_name varchar(255) not null unique,
Created_date datetime not null,
Start_date datetime not null,
End_date datetime not null,
Duration time(0)
)
select*from Question_mapping_table

create table Question_mapping_table(
Question_map_id int primary key identity(1,1),
Test_Id int foreign key references Test_table(Test_Id) not null,
Question_Id int foreign key references Question_table(Question_Id) not null,
)

create table Test_invitation_table(
Invitation_Id int primary key identity(1,1),
Test_Id int foreign key references Test_table(Test_Id) not null,
User_email varchar(100) not null,
Invited_date datetime not null
)
select*from Test_invitation_table

create table Answer_table(
Answer_Id int primary key identity(1,1),
Test_Id int foreign key references Test_table(Test_Id) not null,
User_Id int foreign key references User_table(User_Id) not null,
Question_Id int foreign key references Question_table(Question_Id) not null,
Option_Id int foreign key references option_table(Option_id) not null,
Submit_date datetime not null
)

select*from test_table

insert into subject_table
values('Select'),
('HTML'),
('Asp.Net'),
('SQL')
insert into Difficulty_table
values('Select'),
('Entry-level'),
('Mid-level'),
('Senior-level')

create procedure Get_questions
@Subject_id int = 4,@Difficulty_id int = 4
as begin
select question_id,Questions,st.Subject_name,Difficulty_level
from Question_table qt
inner join Subject_table st on st.Subject_Id = qt.Subject_Id
inner join Difficulty_table
on qt.Difficulty_Id=Difficulty_table.Difficulty_Id
where st.Subject_Id=@Subject_id and qt.Difficulty_Id=@Difficulty_id
end

select Question_Id 
from Question_mapping_table
where Test_Id=1

delete Question_mapping_table
where Test_Id=1

select*from Question_mapping_table

create procedure Find_exist_testid
@test_id int
as begin
declare @result int
if exists (select 1 from Question_mapping_table where Test_Id=@test_id)
begin
set @result = 1
end
else
begin
set @result = 0
end
select @result as Result
end
exec Find_exist_testid @test_id

create procedure Get_invited_users_list
@Test_id int
as begin
select*from Test_invitation_table
where Test_Id=@Test_id
end
exec Get_invited_users_list @test_id=1


select*from Test_table

create procedure Get_mapped_questionIds
@test_id int
as begin
select Question_Id
from Question_mapping_table
where Test_Id=@test_id
end
exec Get_mapped_questionIds 

create procedure Delete_existing_questionIds
@test_id int
as begin
delete Question_mapping_table
where Test_Id=@test_id
end

select*from Question_mapping_table

create procedure Find_email
@Email varchar(100)
as begin
declare @Result int
if exists (select 1 from user_table where email=@Email)
begin
set @result=1
end
else
begin
set @Result=0
end
select @Result as Result
end

select*from test_table
select*from test_invitation_table

alter procedure Get_invited_testlist
@email varchar(100)
as begin
select t.Test_Id,Test_name,Start_date,End_date,Status,Duration
from Test_table t
inner join Test_invitation_table ti
on t.Test_Id=ti.Test_Id
where ti.User_email = @email
end
select*from test_table
select*from test_invitation_table
exec Get_invited_testlist '123@k.com'

select*from Test_table
select*from test_invitation_table
select*from answer_table

select * from Option_table

select t.test_id,Test_name,Start_date,End_date,Duration
from Test_table t
inner join Test_invitation_table ti
on t.Test_Id=ti.Test_Id
where ti.User_email = '123@k.com'

select Question_Id
from Question_mapping_table
where Test_Id=1

create procedure Questions_for_livetest
@test_id int
as begin
select Question_Id,questions
from Question_table
where Question_Id in (select Question_Id
from Question_mapping_table
where Test_Id=@test_id)
end
exec Questions_for_livetest 1
exec Options_for_livetest 1

create procedure Options_for_livetest
@question_id int
as begin
select Option_Id,Options
from Option_table
where Question_Id=@question_id
end

exec Options_for_livetest 1

select*from Question_table
select*from Option_table
select*from Test_invitation_table


exec Get_invited_testlist '123@k.com';

create procedure Get_only_questionids
@Test_id int
as begin
select Question_Id
from question_mapping_table
where test_id=@Test_id
end
exec Get_only_questionids 1

alter procedure Questions_for_livetest
@question_id int
as begin
select Question_Id,Questions
from Question_table
where question_id=@question_id
end
exec Questions_for_livetest 1

select*from answer_table
delete answer_table
where test_id=1

alter table Test_invitation_table
add Result int

select question_id
from question_mapping_table
where test_id =1

select option_id 
from option_table
where answer=1

select*from answer_table
where USER_ID = 1

alter procedure get_result_for_user
@test_id int,@user_id int
as begin
select cast((COUNT(case
when ot.option_id=at.option_id then 1
else null
end)*100.0) / count(distinct ot.question_id)as decimal(5,2)
) as Result_percentage
from option_table ot
left join answer_table at
on at.question_id=ot.question_id and test_id=@test_id and user_id=@user_id
where ot.answer=1 and ot.question_id in (
select question_id
from question_mapping_table
where test_id =@test_id)
end

alter procedure get_result_for_user  
@test_id int,@user_id int  
as begin  

select cast((COUNT(case when ot.option_id=at.option_id then 1 else null end)*100.0) / count(distinct ot.question_id)as decimal(5,2) ) as Result_percentage
from option_table ot left join answer_table at on at.question_id=ot.question_id and test_id=@test_id and user_id=@user_id
 where ot.answer=1 and ot.question_id in ( select question_id from question_mapping_table where test_id =@test_id)  
end

alter procedure Get_result_for_admin
@test_id int
as begin
select at.User_Id,ut.First_name+' '+ut.Last_name as User_name,ut.Email,COUNT(case
when ot.option_id=at.option_id then 1 else null end)*100.0 / (select  COUNT (question_id) from question_Mapping_table where test_id = @test_id) as Result
from answer_table at
inner join user_table ut on ut.user_id=at.user_id
inner join question_mapping_table qt on qt.question_id=at.question_id and qt.test_id=@test_id
inner join option_table ot on ot.option_id=at.option_id and ot.answer=1
where at.test_id = @test_id group by at.user_id,ut.email,ut.First_name+' '+ut.Last_name
order by Result desc
end
Get_result_for_admin 1


