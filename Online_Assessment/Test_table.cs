//------------------------------------------------------------------------------
// <auto-generated>
//    This code was generated from a template.
//
//    Manual changes to this file may cause unexpected behavior in your application.
//    Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace Online_Assessment
{
    using System;
    using System.Collections.Generic;
    
    public partial class Test_table
    {
        public Test_table()
        {
            this.Answer_table = new HashSet<Answer_table>();
            this.Question_mapping_table = new HashSet<Question_mapping_table>();
            this.Test_invitation_table = new HashSet<Test_invitation_table>();
        }
    
        public int Test_Id { get; set; }
        public string Test_name { get; set; }
        public System.DateTime Created_date { get; set; }
        public System.DateTime Start_date { get; set; }
        public System.DateTime End_date { get; set; }
        public Nullable<System.TimeSpan> Duration { get; set; }
    
        public virtual ICollection<Answer_table> Answer_table { get; set; }
        public virtual ICollection<Question_mapping_table> Question_mapping_table { get; set; }
        public virtual ICollection<Test_invitation_table> Test_invitation_table { get; set; }
    }
}
