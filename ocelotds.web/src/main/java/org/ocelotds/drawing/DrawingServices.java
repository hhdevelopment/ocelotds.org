/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
package org.ocelotds.drawing;

import org.ocelotds.Constants;
import org.ocelotds.annotations.DataService;
import org.ocelotds.annotations.JsTopic;
import org.ocelotds.annotations.WsDataService;

/**
 *
 * @author hhfrancois
 */
@DataService(resolver = Constants.Resolver.CDI)
public class DrawingServices {

	@JsTopic("eventCanvas")
	@WsDataService
	public CanvasEvent pushCanvasEvent(CanvasEvent evt) {
		return evt;
	}
}
