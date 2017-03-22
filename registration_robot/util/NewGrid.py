# -*- coding:utf-8
import wx
import wx.grid as gridlib

class SimpleGrid(gridlib.Grid):

    def __init__(self, parent):

        gridlib.Grid.__init__(self, parent, size=(890,300))

        self.moveTo = None

        self.Bind(wx.EVT_IDLE, self.OnIdle)

        self.CreateGrid(25, 5)

        # simple cell formatting
        self.SetColSize(0, 150)
        self.SetColSize(1, 150)
        self.SetColSize(2, 150)
        self.SetColSize(3, 100)
        self.SetColSize(4, 240)

        self.SetColLabelValue(0, u"用户名")
        self.SetColLabelValue(1, u"密码")
        self.SetColLabelValue(2, u"手机号")
    	self.SetColLabelValue(3, u"注册状态")
    	self.SetColLabelValue(4, u"注册时间")

        # test all the events
        self.Bind(gridlib.EVT_GRID_CELL_LEFT_CLICK, self.OnCellLeftClick)
        self.Bind(gridlib.EVT_GRID_CELL_RIGHT_CLICK, self.OnCellRightClick)
        self.Bind(gridlib.EVT_GRID_CELL_LEFT_DCLICK, self.OnCellLeftDClick)
        self.Bind(gridlib.EVT_GRID_CELL_RIGHT_DCLICK, self.OnCellRightDClick)

        self.Bind(gridlib.EVT_GRID_LABEL_LEFT_CLICK, self.OnLabelLeftClick)
        self.Bind(gridlib.EVT_GRID_LABEL_RIGHT_CLICK, self.OnLabelRightClick)
        self.Bind(gridlib.EVT_GRID_LABEL_LEFT_DCLICK, self.OnLabelLeftDClick)
        self.Bind(gridlib.EVT_GRID_LABEL_RIGHT_DCLICK, self.OnLabelRightDClick)

        self.Bind(gridlib.EVT_GRID_ROW_SIZE, self.OnRowSize)
        self.Bind(gridlib.EVT_GRID_COL_SIZE, self.OnColSize)

        self.Bind(gridlib.EVT_GRID_RANGE_SELECT, self.OnRangeSelect)
        self.Bind(gridlib.EVT_GRID_CELL_CHANGE, self.OnCellChange)
        self.Bind(gridlib.EVT_GRID_SELECT_CELL, self.OnSelectCell)

        self.Bind(gridlib.EVT_GRID_EDITOR_SHOWN, self.OnEditorShown)
        self.Bind(gridlib.EVT_GRID_EDITOR_HIDDEN, self.OnEditorHidden)
        self.Bind(gridlib.EVT_GRID_EDITOR_CREATED, self.OnEditorCreated)


    def OnCellLeftClick(self, evt):
        print "OnCellLeftClick: (%d,%d) %s\n" % (evt.GetRow(), evt.GetCol(), evt.GetPosition())
        evt.Skip()

    def OnCellRightClick(self, evt):
        print "OnCellRightClick: (%d,%d) %s\n" % (evt.GetRow(), evt.GetCol(), evt.GetPosition())
        evt.Skip()

    def OnCellLeftDClick(self, evt):
        print "OnCellLeftDClick: (%d,%d) %s\n" % (evt.GetRow(), evt.GetCol(), evt.GetPosition())
        evt.Skip()

    def OnCellRightDClick(self, evt):
        print "OnCellRightDClick: (%d,%d) %s\n" % (evt.GetRow(), evt.GetCol(), evt.GetPosition())
        evt.Skip()

    def OnLabelLeftClick(self, evt):
        print "OnLabelLeftClick: (%d,%d) %s\n" % (evt.GetRow(), evt.GetCol(), evt.GetPosition())
        evt.Skip()

    def OnLabelRightClick(self, evt):
        print "OnLabelRightClick: (%d,%d) %s\n" % (evt.GetRow(), evt.GetCol(), evt.GetPosition())
        evt.Skip()

    def OnLabelLeftDClick(self, evt):
        print "OnLabelLeftDClick: (%d,%d) %s\n" % (evt.GetRow(), evt.GetCol(), evt.GetPosition())
        evt.Skip()

    def OnLabelRightDClick(self, evt):
        print "OnLabelRightDClick: (%d,%d) %s\n" % (evt.GetRow(), evt.GetCol(), evt.GetPosition())
        evt.Skip()

    def OnRowSize(self, evt):
        print "OnRowSize: row %d, %s\n" % (evt.GetRowOrCol(), evt.GetPosition())
        evt.Skip()

    def OnColSize(self, evt):
        print "OnColSize: col %d, %s\n" % (evt.GetRowOrCol(), evt.GetPosition())
        evt.Skip()

    def OnRangeSelect(self, evt):
        if evt.Selecting():
            msg = 'Selected'
        else:
            msg = 'Deselected'
        print "OnRangeSelect: %s  top-left %s, bottom-right %s\n" % (msg, evt.GetTopLeftCoords(),
                                                                     evt.GetBottomRightCoords())
        evt.Skip()


    def OnCellChange(self, evt):
        print "OnCellChange: (%d,%d) %s\n" % (evt.GetRow(), evt.GetCol(), evt.GetPosition())

        # Show how to stay in a cell that has bad data.  We can't just
        # call SetGridCursor here since we are nested inside one so it
        # won't have any effect.  Instead, set coordinates to move to in
        # idle time.
        value = self.GetCellValue(evt.GetRow(), evt.GetCol())

        if value == 'no good':
            self.moveTo = evt.GetRow(), evt.GetCol()


    def OnIdle(self, evt):
        if self.moveTo != None:
            self.SetGridCursor(self.moveTo[0], self.moveTo[1])
            self.moveTo = None

        evt.Skip()


    def OnSelectCell(self, evt):
        if evt.Selecting():
            msg = 'Selected'
        else:
            msg = 'Deselected'

        print "OnSelectCell: %s (%d,%d) %s\n" % (msg, evt.GetRow(), evt.GetCol(), evt.GetPosition())

        # Another way to stay in a cell that has a bad value...
        row = self.GetGridCursorRow()
        col = self.GetGridCursorCol()

        if self.IsCellEditControlEnabled():
            self.HideCellEditControl()
            self.DisableCellEditControl()

        value = self.GetCellValue(row, col)

        if value == 'no good 2':
            return  # cancels the cell selection

        evt.Skip()


    def OnEditorShown(self, evt):
        if evt.GetRow() == 6 and evt.GetCol() == 3 and \
           wx.MessageBox("Are you sure you wish to edit this cell?",
                        "Checking", wx.YES_NO) == wx.NO:
            evt.Veto()
            return

        print "OnEditorShown: (%d,%d) %s\n" % (evt.GetRow(), evt.GetCol(), evt.GetPosition())
        evt.Skip()


    def OnEditorHidden(self, evt):
        if evt.GetRow() == 6 and evt.GetCol() == 3 and \
           wx.MessageBox("Are you sure you wish to  finish editing this cell?",
                        "Checking", wx.YES_NO) == wx.NO:
            evt.Veto()
            return

        print "OnEditorHidden: (%d,%d) %s\n" % (evt.GetRow(), evt.GetCol(), evt.GetPosition())
        evt.Skip()


    def OnEditorCreated(self, evt):
        print "OnEditorCreated: (%d, %d) %s\n" % (evt.GetRow(), evt.GetCol(), evt.GetControl())


if __name__=='__main__':
	pass