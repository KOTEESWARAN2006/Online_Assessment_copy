using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Online_Assessment.Models
{
    public class Question_entity
    {
        public int Question_Id { get; set; }
        public string Questions { get; set; }
        public string Subject_name { get; set; }
        public string Difficulty_level { get; set; }
    }

    public class User_credential
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }

    public class Test_lists
    {
        public int Test_Id { get; set; }
        public string Test_name { get; set; }
        public System.DateTime Start_date { get; set; }
        public System.DateTime End_date { get; set; }
        public Nullable<bool> Status { get; set; }
        public Nullable<System.TimeSpan> Duration { get; set; }
    }

    public class Question_entity_for_test
    {
        public int Question_Id { get; set; }
        public string Questions { get; set; }
    }

    public class Options_enitty_for_test
    {
        public int Option_Id { get; set; }
        public string Options { get; set; }
    }

    public class Admin_results
    {
        public int User_Id { get; set; }
        public string User_name { get; set; }
        public string Email { get; set; }
        public decimal Result { get; set; }
    }
}