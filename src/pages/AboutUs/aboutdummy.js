<div>
        <NavWrapper>
        <h1>Edit About Us Page</h1>
        <div className="Auth-form-container-about">
        <form className="Auth-form-about">
          <div className="Auth-form-content-about">
            <div classname="center">
            </div>
            <div className="form-group mt-3">
              <label>Email</label>
              <input type="text" name="abt_email" value={values.abt_email} onChange={handleInputChange}></input>
            </div>

            <div className="form-group mt-3">
              <label>Website</label>
              <input type="text" name="abt_website" value={values.abt_website} onChange={handleInputChange}></input>
            </div>

            <div className="form-group mt-3">
              <label>Description</label>
              <textarea  name="abt_description" value={values.abt_description} onChange={handleInputChange}></textarea>
            </div>

            <div className="form-group mt-3">
              <label>Address</label>
              <textarea  name="abt_address" value={values.abt_address} onChange={handleInputChange}></textarea>
            </div>
            <br></br>

            <div classname="right">
            <button className="btn btn-primary-upload">
            <label htmlFor="file">Upload Image&nbsp;</label>
            <input
                type="file"
                name="abt_image"
                id="file"
                onChange={(e) => setFile(e.target.files[0])}
                style={{ display: "none" }}
              />        
            </button>
            <input value={file.name} disabled={true}/>           
            </div>
            <br></br>
            
            <div className="login-btn-about">
              <button onClick={UpdateAboutus} className="btn btn-primary-about">
                Save
              </button>
              
            </div>

            <div className="login-btn-about">
              <button onClick={Cancel} className="btn btn-primary-aboutcancel">
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
        </NavWrapper>
      </div>