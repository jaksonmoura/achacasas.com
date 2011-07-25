class InteressesController < ApplicationController
  def destroy
    @interesse = Interessado.find(:first, :conditions => "user_id = #{params[:userid]} AND property_id = #{params[:propertyid]}")
    return if params[:cancel]
    @interesse.destroy

    respond_to do |format|
      format.html { redirect_to(:back, :notice => 'Você foi desmarcado como interessado neste imóvel!') }
      format.js
      format.xml  { head :ok }
    end
  end

end

